using Fortuna.Application.Abstractions.Messaging;

namespace Fortuna.Application.Cards.Commands.RepayCreditCard;

public sealed record RepayCreditCardCommand(Guid CardId) : ICommand<Guid>;
