using System.Reflection;
using Fortuna.Application.Abstractions.Persistence;
using Fortuna.Domain.Accounts;
using Fortuna.Domain.Cards;
using Fortuna.Domain.Customers;
using Fortuna.Domain.Loans;
using Fortuna.Domain.Products;
using Microsoft.EntityFrameworkCore;

namespace Fortuna.Infrastructure.Persistence.Write;

public sealed class WriteDbContext : DbContext, IUnitOfWork
{
    public WriteDbContext(DbContextOptions<WriteDbContext> options) : base(options)
    {
    }

    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<BankAccount> BankAccounts => Set<BankAccount>();
    public DbSet<Card> Cards => Set<Card>();
    public DbSet<Loan> Loans => Set<Loan>();
    public DbSet<TransactionEntry> Transactions => Set<TransactionEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(WriteDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entitiesWithEvents = ChangeTracker
            .Entries()
            .Select(e => e.Entity)
            .Where(entity => entity is not null)
            .Select(entity => new
            {
                Entity = entity!,
                DomainEventsProperty = entity!.GetType().GetProperty("DomainEvents", BindingFlags.Instance | BindingFlags.Public)
            })
            .Where(x => x.DomainEventsProperty is not null)
            .ToList();

        var result = await base.SaveChangesAsync(cancellationToken);

        foreach (var item in entitiesWithEvents)
        {
            var clearMethod = item.Entity.GetType().GetMethod("ClearDomainEvents", BindingFlags.Instance | BindingFlags.Public);
            clearMethod?.Invoke(item.Entity, null);
        }

        return result;
    }
}
