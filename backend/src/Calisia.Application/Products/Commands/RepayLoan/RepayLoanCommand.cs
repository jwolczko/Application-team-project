using Fortuna.Application.Abstractions.Messaging;

namespace Fortuna.Application.Products.Commands.RepayLoan;

public sealed record RepayLoanCommand(
    Guid CustomerId,
    Guid LoanId,
    Guid SourceProductId,
    decimal Amount,
    string Currency,
    string Title) : ICommand<Guid>;
