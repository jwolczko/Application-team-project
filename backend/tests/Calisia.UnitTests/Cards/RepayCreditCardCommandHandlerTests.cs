using FluentAssertions;
using Fortuna.Application.Abstractions.Persistence;
using Fortuna.Application.Cards.Commands.RepayCreditCard;
using Fortuna.Domain.Accounts;
using Fortuna.Domain.Accounts.Repositories;
using Fortuna.Domain.Cards;
using Fortuna.Domain.Customers;
using Fortuna.Domain.Products.Repositories;
using NSubstitute;
using Xunit;

namespace Fortuna.UnitTests.Cards;

public sealed class RepayCreditCardCommandHandlerTests
{
    [Fact]
    public async Task HandleShouldWithdrawUsedLimitFromMainAccountAndRestoreCreditCardBalance()
    {
        var productRepository = Substitute.For<IProductRepository>();
        var bankAccountRepository = Substitute.For<IBankAccountRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();
        var customerId = CustomerId.New();
        var creditCard = Card.Create(customerId, "Karta kredytowa", "5400696900000002", 1, "PLN", CardType.Credit, 2000m);
        var mainAccount = BankAccount.Open(
            customerId,
            new AccountNumber("13696969690000000000000001"),
            "Konto glowne",
            2,
            "PLN",
            BankAccountType.Standard,
            true);

        creditCard.Withdraw(new Money(450m, "PLN"), "Płatność testowa");
        mainAccount.Deposit(new Money(1000m, "PLN"), "Zasilenie testowe");
        creditCard.ClearDomainEvents();
        mainAccount.ClearDomainEvents();

        productRepository.GetByIdAsync(creditCard.Id, Arg.Any<CancellationToken>())
            .Returns(creditCard);
        bankAccountRepository.GetMainByCustomerIdAsync(customerId, Arg.Any<CancellationToken>())
            .Returns(mainAccount);

        var sut = new RepayCreditCardCommandHandler(productRepository, bankAccountRepository, unitOfWork);

        await sut.Handle(
            new RepayCreditCardCommand(creditCard.Id),
            CancellationToken.None);

        mainAccount.Balance.Amount.Should().Be(550m);
        creditCard.Balance.Amount.Should().Be(2000m);
        await unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }
}
