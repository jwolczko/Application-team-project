using Fortuna.Application.Abstractions.Messaging;

namespace Fortuna.Application.Products.Commands.RepayCashLoan;

public sealed record RepayCashLoanCommand(
    Guid CustomerId,
    Guid ProductId,
    Guid MainAccountId) : ICommand<Guid>;
