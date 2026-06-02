namespace Fortuna.Contracts.Cards;

public sealed record SimulateCardPaymentRequest(
    decimal Amount,
    string Currency,
    string Title);
