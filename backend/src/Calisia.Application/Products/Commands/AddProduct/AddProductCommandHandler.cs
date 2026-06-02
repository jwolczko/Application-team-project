using Fortuna.Application.Abstractions.Messaging;
using Fortuna.Application.Abstractions.Persistence;
using Fortuna.Application.Common.Exceptions;
using Fortuna.Domain.Accounts;
using Fortuna.Domain.Accounts.Repositories;
using Fortuna.Domain.Cards;
using Fortuna.Domain.Customers;
using Fortuna.Domain.Customers.Repositories;
using Fortuna.Domain.Loans;
using Fortuna.Domain.Products;
using Fortuna.Domain.Products.Repositories;

namespace Fortuna.Application.Products.Commands.AddProduct;

public sealed class AddProductCommandHandler : ICommandHandler<AddProductCommand, Guid>
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IProductRepository _productRepository;
    private readonly IBankAccountRepository _bankAccountRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AddProductCommandHandler(
        ICustomerRepository customerRepository,
        IProductRepository productRepository,
        IBankAccountRepository bankAccountRepository,
        IUnitOfWork unitOfWork)
    {
        _customerRepository = customerRepository;
        _productRepository = productRepository;
        _bankAccountRepository = bankAccountRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(AddProductCommand command, CancellationToken cancellationToken)
    {
        var customerId = new CustomerId(command.CustomerId);
        var customer = await _customerRepository.GetByIdAsync(customerId, cancellationToken);
        if (customer is null)
            throw new NotFoundException("Customer not found.");

        if (string.IsNullOrWhiteSpace(command.ProductName))
            throw new ValidationException("Product name is required.");

        if (string.IsNullOrWhiteSpace(command.Currency))
            throw new ValidationException("Currency is required.");

        var nextNumberSequence = await _productRepository.GetNextNumberSequenceAsync(cancellationToken);
        var product = CreateProduct(command, customerId, nextNumberSequence);

        await _productRepository.AddAsync(product, cancellationToken);

        if (product is Loan loan)
        {
            var mainAccount = await _bankAccountRepository.GetMainByCustomerIdAsync(customerId, cancellationToken);
            if (mainAccount is null)
                throw new ValidationException("Main account is required to take a loan.");

            mainAccount.Deposit(loan.Balance, "Uruchomienie kredytu gotówkowego");
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return product.Id;
    }

    private static Product CreateProduct(AddProductCommand command, CustomerId customerId, long numberSequence)
    {
        var category = ParseEnum<ProductCategory>(command.ProductCategory, "Product category is invalid.");

        return category switch
        {
            ProductCategory.BankAccount => BankAccount.Open(
                customerId,
                new AccountNumber(ProductNumberGenerator.GenerateAccountNumber(numberSequence)),
                command.ProductName,
                numberSequence,
                command.Currency,
                ParseEnum<BankAccountType>(command.ProductType, "Bank account type is invalid.")),

            ProductCategory.Card => Card.Create(
                customerId,
                command.ProductName,
                ProductNumberGenerator.GenerateCardNumber(numberSequence),
                numberSequence,
                command.Currency,
                ParseEnum<CardType>(command.ProductType, "Card type is invalid."),
                command.CreditLimit),

            ProductCategory.Loan => Loan.Create(
                customerId,
                command.ProductName,
                ProductNumberGenerator.GenerateLoanNumber(numberSequence),
                numberSequence,
                command.Currency,
                ParseEnum<LoanType>(command.ProductType, "Loan type is invalid."),
                GetRequiredPositiveInitialBalance(command.InitialBalance)),

            _ => throw new ValidationException("Product category is invalid.")
        };
    }

    private static TEnum ParseEnum<TEnum>(int value, string errorMessage)
        where TEnum : struct, Enum
    {
        if (Enum.IsDefined(typeof(TEnum), value))
            return (TEnum)Enum.ToObject(typeof(TEnum), value);

        throw new ValidationException(errorMessage);
    }

    private static decimal GetRequiredPositiveInitialBalance(decimal? initialBalance)
    {
        if (!initialBalance.HasValue)
            throw new ValidationException("Initial balance is required for loan.");

        if (initialBalance.Value <= 0)
            throw new ValidationException("Initial balance must be greater than zero.");

        return initialBalance.Value;
    }
}
