using FluentAssertions;
using Fortuna.Application.Abstractions.Persistence;
using Fortuna.Application.Common.Exceptions;
using Fortuna.Application.Products.Commands.RepayCashLoan;
using Fortuna.Domain.Accounts;
using Fortuna.Domain.Accounts.Repositories;
using Fortuna.Domain.Customers;
using Fortuna.Domain.Loans;
using Fortuna.Domain.Products;
using Fortuna.Domain.Products.Events;
using Fortuna.Domain.Products.Repositories;
using NSubstitute;
using Xunit;

namespace Fortuna.UnitTests.Products;

public sealed class RepayCashLoanCommandHandlerTests
{
    [Fact]
    public async Task HandleShouldWithdrawLoanAmountFromMainAccountAndRemoveLoan()
    {
        var productRepository = Substitute.For<IProductRepository>();
        var bankAccountRepository = Substitute.For<IBankAccountRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();
        var customerId = CustomerId.New();
        var loan = Loan.Create(
            customerId,
            "Kredyt gotowkowy",
            "LN00000000000015",
            15,
            "PLN",
            LoanType.Cash,
            12000m);
        var mainAccount = BankAccount.Open(
            customerId,
            new AccountNumber("13696969690000000000000001"),
            "Konto glowne",
            1,
            "PLN",
            BankAccountType.Standard,
            true);

        mainAccount.Deposit(new Money(15000m, "PLN"), "Zasilenie testowe");
        mainAccount.ClearDomainEvents();
        loan.ClearDomainEvents();

        productRepository.GetByIdAsync(loan.Id, Arg.Any<CancellationToken>())
            .Returns(loan);
        bankAccountRepository.GetByIdAsync(mainAccount.Id, Arg.Any<CancellationToken>())
            .Returns(mainAccount);

        var sut = new RepayCashLoanCommandHandler(productRepository, bankAccountRepository, unitOfWork);

        var result = await sut.Handle(
            new RepayCashLoanCommand(customerId.Value, loan.Id, mainAccount.Id),
            CancellationToken.None);

        result.Should().Be(loan.Id);
        mainAccount.Balance.Amount.Should().Be(3000m);
        loan.DomainEvents.Should().ContainSingle(x => x is ProductDeletedDomainEvent);
        productRepository.Received(1).Remove(loan);
        await unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task HandleShouldThrowWhenProductIsNotCashLoan()
    {
        var productRepository = Substitute.For<IProductRepository>();
        var bankAccountRepository = Substitute.For<IBankAccountRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();

        productRepository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns((Product?)null);

        var sut = new RepayCashLoanCommandHandler(productRepository, bankAccountRepository, unitOfWork);

        var act = () => sut.Handle(
            new RepayCashLoanCommand(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid()),
            CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
        productRepository.DidNotReceive().Remove(Arg.Any<Product>());
    }
}
