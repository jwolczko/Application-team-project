using Fortuna.Application.Abstractions.Messaging;

namespace Fortuna.Application.Products.Commands.AddProduct;

public sealed record AddProductCommand(
    Guid CustomerId,
    int ProductCategory,
    string ProductName,
    string Currency,
    int ProductType,
    decimal? CreditLimit,
    decimal? InitialBalance) : ICommand<Guid>;
