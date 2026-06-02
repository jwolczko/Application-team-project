using Fortuna.Application.Abstractions.Messaging;
using Fortuna.Application.Abstractions.Persistence;
using Fortuna.Application.Common.Exceptions;
using Fortuna.Domain.Accounts;
using Fortuna.Domain.Accounts.Repositories;
using Fortuna.Domain.Loans;
using Fortuna.Domain.Products.Repositories;

namespace Fortuna.Application.Products.Commands.RepayCashLoan;

public sealed class RepayCashLoanCommandHandler : ICommandHandler<RepayCashLoanCommand, Guid>
{
    private readonly IProductRepository _productRepository;
    private readonly IBankAccountRepository _bankAccountRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RepayCashLoanCommandHandler(
        IProductRepository productRepository,
        IBankAccountRepository bankAccountRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _bankAccountRepository = bankAccountRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(RepayCashLoanCommand command, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(command.ProductId, cancellationToken);
        if (product is not Loan loan || product.CustomerId.Value != command.CustomerId)
            throw new NotFoundException("Cash loan not found.");

        if (loan.LoanType != LoanType.Cash)
            throw new ValidationException("Early repayment is supported only for cash loans.");

        var mainAccount = await _bankAccountRepository.GetByIdAsync(command.MainAccountId, cancellationToken);
        if (mainAccount is null || mainAccount.CustomerId.Value != command.CustomerId || mainAccount.MainAccount != true)
            throw new ValidationException("Main account is required to repay a loan.");

        mainAccount.Withdraw(
            new Money(loan.Balance.Amount, loan.Currency),
            $"Wcześniejsza spłata: {loan.ProductName}");

        loan.MarkDeleted();
        _productRepository.Remove(loan);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return loan.Id;
    }
}
