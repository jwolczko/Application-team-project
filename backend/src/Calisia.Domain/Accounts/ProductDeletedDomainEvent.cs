using Fortuna.Domain.Abstractions;

namespace Fortuna.Domain.Products.Events;

public sealed record ProductDeletedDomainEvent(
    Guid ProductId,
    Guid CustomerId) : IDomainEvent
{
    public DateTime OccurredOnUtc { get; } = DateTime.UtcNow;
}
