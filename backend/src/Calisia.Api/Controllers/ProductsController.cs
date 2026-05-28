using Fortuna.Api.Security;
using Fortuna.Application.Products.Commands.AddProduct;
using Fortuna.Application.Products.Commands.RepayLoan;
using Fortuna.Contracts.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fortuna.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/products")]
public sealed class ProductsController : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<Guid>> Add(
        [FromBody] AddProductRequest request,
        [FromServices] AddProductCommandHandler handler,
        CancellationToken cancellationToken)
    {
        var customerId = User.GetRequiredCustomerId();

        var productId = await handler.Handle(
            new AddProductCommand(
                customerId,
                request.ProductCategory,
                request.ProductName,
                request.Currency,
                request.ProductType,
                request.CreditLimit,
                request.InitialBalance),
            cancellationToken);

        return Ok(productId);
    }

    [HttpPost("{loanId:guid}/repay")]
    public async Task<ActionResult<Guid>> RepayLoan(
        Guid loanId,
        [FromBody] RepayLoanRequest request,
        [FromServices] RepayLoanCommandHandler handler,
        CancellationToken cancellationToken)
    {
        var customerId = User.GetRequiredCustomerId();

        var transferId = await handler.Handle(
            new RepayLoanCommand(
                customerId,
                loanId,
                request.SourceProductId,
                request.Amount,
                request.Currency,
                request.Title),
            cancellationToken);

        return Ok(transferId);
    }
}
