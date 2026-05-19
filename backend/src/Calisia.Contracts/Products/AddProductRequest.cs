namespace Fortuna.Contracts.Products;

public sealed record AddProductRequest(
    int ProductCategory,
    string ProductName,
    string Currency,
    int ProductType,
    decimal? CreditLimit,
    decimal? InitialBalance);
