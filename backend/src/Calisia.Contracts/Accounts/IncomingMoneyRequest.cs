namespace Fortuna.Contracts.Accounts;

public sealed record IncomingMoneyRequest(
    Guid TargetAccountId,
    decimal Amount,
    string Currency,
    string Title);
