using Fortuna.Application.Accounts.Commands.DepositMoney;
using Fortuna.Contracts.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fortuna.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/accounts")]
public sealed class IncommingController : ControllerBase
{
    [HttpPost("incoming")]
    public async Task<ActionResult<Guid>> Incoming(
        [FromBody] IncomingMoneyRequest request,
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
