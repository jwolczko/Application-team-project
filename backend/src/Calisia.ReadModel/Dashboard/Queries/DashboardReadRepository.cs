using Fortuna.Application.Dashboard.Queries.GetDashboard;
using Fortuna.ReadModel.Dashboard.ReadModels;
using Fortuna.ReadModel.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Fortuna.ReadModel.Dashboard.Queries;

public sealed class DashboardReadRepository : IDashboardReadRepository
{
    private readonly ReadDbContext _dbContext;

    public DashboardReadRepository(ReadDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DashboardDto> GetDashboardAsync(Guid customerId, CancellationToken cancellationToken)
    {
        var productTiles = await _dbContext.ProductTiles
            .AsNoTracking()
            .Where(x => x.CustomerId == customerId)
            .OrderBy(x => x.ProductCategory)
            .ThenBy(x => x.ProductName)
            .ToListAsync(cancellationToken);

        var mainAccountBalance = productTiles
            .Where(IsMainBankAccount)
            .Select(x => (decimal?)x.Balance)
            .FirstOrDefault();

        var products = productTiles
            .Select(x => new ProductTileDto(
                x.ProductId,
                x.ProductCategory,
                x.ProductType,
                x.ProductName,
                x.ProductNumber,
                GetDisplayedBalance(x, mainAccountBalance),
                x.Currency,
                x.MainAccount))
            .ToList();

        var events = await _dbContext.TimelineEvents
            .AsNoTracking()
            .Where(x => x.CustomerId == customerId)
            .OrderByDescending(x => x.EventDateUtc)
            .Take(20)
            .Select(x => new TimelineEventDto(
                x.Id,
                x.EventDateUtc,
                x.EventType,
                x.Title,
                x.Amount,
                x.Currency,
                x.IsPositive))
            .ToListAsync(cancellationToken);

        var totalBalance = productTiles.Sum(x => GetBalanceForTotal(x, mainAccountBalance));
        var currency = products.FirstOrDefault()?.Currency ?? "PLN";

        return new DashboardDto(customerId, totalBalance, currency, products, events);
    }

    private static decimal GetDisplayedBalance(ProductTileReadModel productTile, decimal? mainAccountBalance)
    {
        if (IsDebitCard(productTile) && mainAccountBalance.HasValue)
            return mainAccountBalance.Value;

        return productTile.Balance;
    }

    private static decimal GetBalanceForTotal(ProductTileReadModel productTile, decimal? mainAccountBalance)
    {
        if (IsDebitCard(productTile) && mainAccountBalance.HasValue)
            return 0m;

        return productTile.Balance;
    }

    private static bool IsMainBankAccount(ProductTileReadModel productTile)
        => string.Equals(productTile.ProductCategory, "BankAccount", StringComparison.OrdinalIgnoreCase)
            && productTile.MainAccount == true;

    private static bool IsDebitCard(ProductTileReadModel productTile)
        => string.Equals(productTile.ProductCategory, "Card", StringComparison.OrdinalIgnoreCase)
            && string.Equals(productTile.ProductType, "Debit", StringComparison.OrdinalIgnoreCase);
}
