using Fortuna.Application.Abstractions.Messaging;
using Fortuna.Application.Abstractions.Persistence;
using Fortuna.Application.Common.Exceptions;
using Fortuna.Domain.Accounts;
using Fortuna.Domain.Accounts.Repositories;
using Fortuna.Domain.Cards;
using Fortuna.Domain.Customers;
using Fortuna.Domain.Products.Repositories;

namespace Fortuna.Application.Cards.Commands.SimulateCardPayment;

public sealed class SimulateCardPaymentCommandHandler : ICommandHandler<SimulateCardPaymentCommand, Guid>
{
    private readonly IProductRepository _productRepository;
    private readonly IBankAccountRepository _bankAccountRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SimulateCardPaymentCommandHandler(
        IProductRepository productRepository,
        IBankAccountRepository bankAccountRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _bankAccountRepository = bankAccountRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(SimulateCardPaymentCommand command, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(command.Title))
            throw new ValidationException("Payment title is required.");

        var product = await _productRepository.GetByIdAsync(command.CardId, cancellationToken);
        if (product is not Card card)
            throw new NotFoundException("Card not found.");

        var amount = new Money(command.Amount, command.Currency);
        var title = $"Płatność kartą: {command.Title.Trim()}";

        if (card.CardType == CardType.Debit)
        {
            var mainAccount = await _bankAccountRepository.GetMainByCustomerIdAsync(product.CustomerId, cancellationToken);
            if (mainAccount is null)
                throw new ValidationException("Main account is required for debit card payment.");

            mainAccount.Withdraw(amount, title);
        }
        else
        {
            card.Withdraw(amount, title);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return card.Id;
    }
}
