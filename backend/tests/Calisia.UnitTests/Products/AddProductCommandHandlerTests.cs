using FluentAssertions;
using Fortuna.Application.Abstractions.Persistence;
using Fortuna.Application.Common.Exceptions;
using Fortuna.Application.Products.Commands.AddProduct;
using Fortuna.Domain.Accounts;
using Fortuna.Domain.Accounts.Repositories;
using Fortuna.Domain.Cards;
using Fortuna.Domain.Customers;
using Fortuna.Domain.Customers.Repositories;
using Fortuna.Domain.Loans;
using Fortuna.Domain.Products;
using Fortuna.Domain.Products.Repositories;
using NSubstitute;
using Xunit;

namespace Fortuna.UnitTests.Products;

public sealed class AddProductCommandHandlerTests
{
    [Fact]
    public async Task HandleShouldCreateProductForExistingCustomer()
    {
        var customerRepository = Substitute.For<ICustomerRepository>();
        var productRepository = Substitute.For<IProductRepository>();
        var bankAccountRepository = Substitute.For<IBankAccountRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();
        Product? addedProduct = null;
        var customerId = CustomerId.New();
        var customer = new Customer(customerId, new FullName("Jan", "Kowalski"), new Email("jan@example.com"), "hashed");

        customerRepository.GetByIdAsync(customerId, Arg.Any<CancellationToken>())
            .Returns(customer);
        productRepository.GetNextNumberSequenceAsync(Arg.Any<CancellationToken>())
            .Returns(8L);
        productRepository.AddAsync(Arg.Do<Product>(product => addedProduct = product), Arg.Any<CancellationToken>())
            .Returns(Task.CompletedTask);

        var sut = new AddProductCommandHandler(customerRepository, productRepository, bankAccountRepository, unitOfWork);

        var result = await sut.Handle(
            new AddProductCommand(
                customerId.Value,
                (int)ProductCategory.Card,
                "Karta kredytowa",
                "PLN",
                (int)CardType.Credit,
                5000m,
                null),
            CancellationToken.None);

        result.Should().NotBeEmpty();
        addedProduct.Should().BeOfType<Card>();
        var card = addedProduct.As<Card>();
        card.CustomerId.Should().Be(customerId);
        card.ProductName.Should().Be("Karta kredytowa");
        card.ProductNumber.Should().Be("5400696900000008");
        card.CardType.Should().Be(CardType.Credit);
        card.CreditLimit.Should().Be(5000m);
        await unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task HandleShouldThrowWhenCustomerDoesNotExist()
    {
        var customerRepository = Substitute.For<ICustomerRepository>();
        var productRepository = Substitute.For<IProductRepository>();
        var bankAccountRepository = Substitute.For<IBankAccountRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();

        customerRepository.GetByIdAsync(Arg.Any<CustomerId>(), Arg.Any<CancellationToken>())
            .Returns((Customer?)null);

        var sut = new AddProductCommandHandler(customerRepository, productRepository, bankAccountRepository, unitOfWork);

        var act = () => sut.Handle(
            new AddProductCommand(
                Guid.NewGuid(),
                (int)ProductCategory.Card,
                "Karta debetowa",
                "PLN",
                (int)CardType.Debit,
                null,
                null),
            CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
        await productRepository.DidNotReceive().AddAsync(Arg.Any<Product>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task HandleShouldCreateCashLoanForExistingCustomer()
    {
        var customerRepository = Substitute.For<ICustomerRepository>();
        var productRepository = Substitute.For<IProductRepository>();
        var bankAccountRepository = Substitute.For<IBankAccountRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();
        Product? addedProduct = null;
        var customerId = CustomerId.New();
        var customer = new Customer(customerId, new FullName("Jan", "Kowalski"), new Email("jan@example.com"), "hashed");
        var mainAccount = BankAccount.Open(
            customerId,
            new AccountNumber("13696969690000000000000001"),
            "Konto glowne",
            1,
            "PLN",
            BankAccountType.Standard,
            true);

        customerRepository.GetByIdAsync(customerId, Arg.Any<CancellationToken>())
            .Returns(customer);
        productRepository.GetNextNumberSequenceAsync(Arg.Any<CancellationToken>())
            .Returns(12L);
        productRepository.AddAsync(Arg.Do<Product>(product => addedProduct = product), Arg.Any<CancellationToken>())
            .Returns(Task.CompletedTask);
        bankAccountRepository.GetMainByCustomerIdAsync(customerId, Arg.Any<CancellationToken>())
            .Returns(mainAccount);

        var sut = new AddProductCommandHandler(customerRepository, productRepository, bankAccountRepository, unitOfWork);

        var result = await sut.Handle(
            new AddProductCommand(
                customerId.Value,
                (int)ProductCategory.Loan,
                "Kredyt gotowkowy",
                "PLN",
                (int)LoanType.Cash,
                null,
                15000m),
            CancellationToken.None);

        result.Should().NotBeEmpty();
        addedProduct.Should().BeOfType<Loan>();
        var loan = addedProduct.As<Loan>();
        loan.CustomerId.Should().Be(customerId);
        loan.ProductName.Should().Be("Kredyt gotowkowy");
        loan.ProductNumber.Should().Be("LN00000000000012");
        loan.LoanType.Should().Be(LoanType.Cash);
        loan.Balance.Amount.Should().Be(15000m);
        loan.Balance.Currency.Should().Be("PLN");
        mainAccount.Balance.Amount.Should().Be(15000m);
        mainAccount.Balance.Currency.Should().Be("PLN");
        await unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task HandleShouldRequireInitialBalanceForLoan()
    {
        var customerRepository = Substitute.For<ICustomerRepository>();
        var productRepository = Substitute.For<IProductRepository>();
        var bankAccountRepository = Substitute.For<IBankAccountRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();
        var customerId = CustomerId.New();
        var customer = new Customer(customerId, new FullName("Jan", "Kowalski"), new Email("jan@example.com"), "hashed");

        customerRepository.GetByIdAsync(customerId, Arg.Any<CancellationToken>())
            .Returns(customer);
        productRepository.GetNextNumberSequenceAsync(Arg.Any<CancellationToken>())
            .Returns(9L);

        var sut = new AddProductCommandHandler(customerRepository, productRepository, bankAccountRepository, unitOfWork);

        var act = () => sut.Handle(
            new AddProductCommand(
                customerId.Value,
                (int)ProductCategory.Loan,
                "Kredyt gotowkowy",
                "PLN",
                (int)LoanType.Cash,
                null,
                null),
            CancellationToken.None);

        await act.Should().ThrowAsync<ValidationException>()
            .WithMessage("Initial balance is required for loan.");
        await productRepository.DidNotReceive().AddAsync(Arg.Any<Product>(), Arg.Any<CancellationToken>());
    }
}
