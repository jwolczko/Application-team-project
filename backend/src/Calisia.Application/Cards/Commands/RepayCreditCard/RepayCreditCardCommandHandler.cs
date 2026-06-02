using Fortuna.Application.Abstractions.Messaging;
using Fortuna.Application.Abstractions.Persistence;
using Fortuna.Application.Common.Exceptions;
using Fortuna.Domain.Accounts;
using Fortuna.Domain.Accounts.Repositories;
using Fortuna.Domain.Cards;
using Fortuna.Domain.Customers;
using Fortuna.Domain.Products.Repositories;

namespace Fortuna.Application.Cards.Commands.RepayCreditCard;

public sealed class RepayCreditCardCommandHandler : ICommandHandler<RepayCreditCardCommand, Guid>
{
    private readonly IProductRepository _productRepository;
    private readonly IBankAccountRepository _bankAccountRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RepayCreditCardCommandHandler(
        IProductRepository productRepository,
        IBankAccountRepository bankAccountRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _bankAccountRepository = bankAccountRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(RepayCreditCardCommand command, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(command.CardId, cancellationToken);
        if (product is not Card card)
            throw new NotFoundException("Credit card not found.");

        if (card.CardType != CardType.Credit || !card.CreditLimit.HasValue)
            throw new ValidationException("Repayment is supported only for credit cards.");

        var repaymentAmount = card.GetUsedCreditLimit();
        if (repaymentAmount <= 0)
            throw new ValidationException("Credit card does not require repayment.");

        var mainAccount = await _bankAccountRepository.GetMainByCustomerIdAsync(product.CustomerId, cancellationToken);
        if (mainAccount is null)
            throw new ValidationException("Main account is required to repay a credit card.");

        var repayment = new Money(repaymentAmount, card.Currency);
        var title = $"Spłata karty kredytowej: {card.ProductName}";

        mainAccount.Withdraw(repayment, title);
        card.Deposit(repayment, title);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return card.Id;
    }
}
