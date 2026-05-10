using Fortuna.Application.Accounts.Commands.DepositMoney;
using Fortuna.Contracts.Transfers;
using Microsoft.AspNetCore.Mvc;

namespace Fortuna.Api.Controllers;

[ApiController]
[Route("api/transfers")]
public sealed class IncommingController : ControllerBase
{
    [HttpPost("incoming")]
    public async Task<ActionResult<Guid>> Incoming(
        [FromBody] IncomingTransferRequest request,
        [FromServices] DepositMoneyCommandHandler handler,
        CancellationToken cancellationToken)
    {

        var result = await handler.Handle(
            new DepositMoneyCommand(
                request.TargetAccountId,
                request.Amount,
                request.Currency,
                request.Title),
            cancellationToken);

        return Ok(result);
    }
}
