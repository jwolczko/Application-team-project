namespace Fortuna.Contracts.Products;

public sealed record RepayLoanRequest(
    Guid SourceProductId,
    decimal Amount,
    string Currency,
    string Title);
