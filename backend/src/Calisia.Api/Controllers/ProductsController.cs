using Fortuna.Api.Security;
using Fortuna.Application.Products.Commands.AddProduct;
using Fortuna.Application.Products.Commands.RepayCashLoan;
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

    [HttpPost("{productId:guid}/early-repayment")]
    public async Task<ActionResult<Guid>> RepayCashLoanEarly(
        Guid productId,
        [FromBody] RepayCashLoanRequest request,
        [FromServices] RepayCashLoanCommandHandler handler,
        CancellationToken cancellationToken)
    {
        var customerId = User.GetRequiredCustomerId();

        var repaidProductId = await handler.Handle(
            new RepayCashLoanCommand(customerId, productId, request.MainAccountId),
            cancellationToken);

        return Ok(repaidProductId);
    }
}
