using FluentAssertions;
using Fortuna.Application.Abstractions.Persistence;
using Fortuna.Application.Cards.Commands.SimulateCardPayment;
using Fortuna.Domain.Accounts;
using Fortuna.Domain.Accounts.Repositories;
using Fortuna.Domain.Cards;
using Fortuna.Domain.Customers;
using Fortuna.Domain.Products;
using Fortuna.Domain.Products.Repositories;
using NSubstitute;
using Xunit;

namespace Fortuna.UnitTests.Cards;

public sealed class SimulateCardPaymentCommandHandlerTests
{
    [Fact]
    public async Task HandleShouldWithdrawFromMainAccountForDebitCardPayment()
    {
        var productRepository = Substitute.For<IProductRepository>();
        var bankAccountRepository = Substitute.For<IBankAccountRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();
        var customerId = CustomerId.New();
        var debitCard = Card.Create(customerId, "Karta debetowa", "5400696900000001", 1, "PLN", CardType.Debit);
        var mainAccount = BankAccount.Open(
            customerId,
            new AccountNumber("13696969690000000000000001"),
            "Konto glowne",
            2,
            "PLN",
            BankAccountType.Standard,
            true);
        mainAccount.Deposit(new Money(500m, "PLN"), "Zasilenie testowe");
        mainAccount.ClearDomainEvents();

        productRepository.GetByIdAsync(debitCard.Id, Arg.Any<CancellationToken>())
            .Returns(debitCard);
        bankAccountRepository.GetMainByCustomerIdAsync(customerId, Arg.Any<CancellationToken>())
            .Returns(mainAccount);

        var sut = new SimulateCardPaymentCommandHandler(productRepository, bankAccountRepository, unitOfWork);

        await sut.Handle(
            new SimulateCardPaymentCommand(debitCard.Id, 120m, "PLN", "Sklep"),
            CancellationToken.None);

        mainAccount.Balance.Amount.Should().Be(380m);
        debitCard.Balance.Amount.Should().Be(0m);
        await unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task HandleShouldWithdrawFromCreditCardBalanceForCreditCardPayment()
    {
        var productRepository = Substitute.For<IProductRepository>();
        var bankAccountRepository = Substitute.For<IBankAccountRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();
        var customerId = CustomerId.New();
        var creditCard = Card.Create(customerId, "Karta kredytowa", "5400696900000002", 1, "PLN", CardType.Credit, 2000m);

        productRepository.GetByIdAsync(creditCard.Id, Arg.Any<CancellationToken>())
            .Returns(creditCard);

        var sut = new SimulateCardPaymentCommandHandler(productRepository, bankAccountRepository, unitOfWork);

        await sut.Handle(
            new SimulateCardPaymentCommand(creditCard.Id, 250m, "PLN", "Hotel"),
            CancellationToken.None);

        creditCard.Balance.Amount.Should().Be(1750m);
        await bankAccountRepository.DidNotReceive()
            .GetMainByCustomerIdAsync(Arg.Any<CustomerId>(), Arg.Any<CancellationToken>());
        await unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }
}
