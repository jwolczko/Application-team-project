using Fortuna.Application.Abstractions.Messaging;

namespace Fortuna.Application.Cards.Commands.SimulateCardPayment;

public sealed record SimulateCardPaymentCommand(
    Guid CardId,
    decimal Amount,
    string Currency,
    string Title) : ICommand<Guid>;
