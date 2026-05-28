using Fortuna.Application.Abstractions.Messaging;
using Fortuna.Application.Abstractions.Persistence;
using Fortuna.Application.Common.Exceptions;
using Fortuna.Domain.Accounts;
using Fortuna.Domain.Cards;
using Fortuna.Domain.Loans;
using Fortuna.Domain.Products;
using Fortuna.Domain.Products.Repositories;
using Fortuna.Domain.Transfers;
using Fortuna.Domain.Transfers.Repositories;

namespace Fortuna.Application.Products.Commands.RepayLoan;

public sealed class RepayLoanCommandHandler : ICommandHandler<RepayLoanCommand, Guid>
{
    private readonly IProductRepository _productRepository;
    private readonly ITransferRepository _transferRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RepayLoanCommandHandler(
        IProductRepository productRepository,
        ITransferRepository transferRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _transferRepository = transferRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(RepayLoanCommand command, CancellationToken cancellationToken)
    {
        if (command.SourceProductId == command.LoanId)
            throw new ValidationException("Source product and loan must be different.");

        if (string.IsNullOrWhiteSpace(command.Title))
            throw new ValidationException("Title is required.");

        var amount = new Money(command.Amount, command.Currency);
        var source = await _productRepository.GetByIdAsync(command.SourceProductId, cancellationToken);
        var loan = await _productRepository.GetByIdAsync(command.LoanId, cancellationToken);

        if (source is null || source.CustomerId.Value != command.CustomerId)
            throw new NotFoundException("Source product not found.");

        if (loan is not Loan customerLoan || customerLoan.CustomerId.Value != command.CustomerId)
            throw new NotFoundException("Loan not found.");

        var repayment = Transfer.CreateOwn(source.Id, customerLoan.Id, amount, command.Title);

        WithdrawFromProduct(source, amount, command.Title, repayment.Id.Value);
        customerLoan.Repay(amount, command.Title);
        repayment.MarkCompleted();

        await _transferRepository.AddAsync(repayment, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return repayment.Id.Value;
    }

    private static void WithdrawFromProduct(Product product, Money amount, string title, Guid transferId)
    {
        switch (product)
        {
            case BankAccount bankAccount:
                bankAccount.Withdraw(amount, title, transferId);
                break;
            case Card card:
                card.Withdraw(amount, title, transferId);
                break;
            default:
                throw new ValidationException("Loan repayments are supported only from bank accounts and cards.");
        }
    }
}
