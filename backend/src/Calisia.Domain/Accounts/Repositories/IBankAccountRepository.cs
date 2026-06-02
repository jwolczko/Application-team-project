using Fortuna.Domain.Customers;

namespace Fortuna.Domain.Accounts.Repositories;

public interface IBankAccountRepository
{
    Task AddAsync(BankAccount bankAccount, CancellationToken cancellationToken);
    Task<BankAccount?> GetByIdAsync(Guid bankAccountId, CancellationToken cancellationToken);
    Task<BankAccount?> GetMainByCustomerIdAsync(CustomerId customerId, CancellationToken cancellationToken);
}
