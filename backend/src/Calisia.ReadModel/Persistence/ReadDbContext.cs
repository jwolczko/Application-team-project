using Microsoft.EntityFrameworkCore;

namespace Fortuna.ReadModel.Persistence;

public sealed class ReadDbContext : DbContext
{
    public ReadDbContext(DbContextOptions<ReadDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ReadDbContext).Assembly);
    }
}
