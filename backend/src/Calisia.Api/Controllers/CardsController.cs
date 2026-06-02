using Fortuna.Api.Security;
using Fortuna.Application.Cards.Commands.RepayCreditCard;
using Fortuna.Application.Cards.Commands.SimulateCardPayment;
using Fortuna.Contracts.Cards;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fortuna.Api.Controllers;

[ApiController]
[Route("api/cards")]
public sealed class CardsController : ControllerBase
{
    [HttpPost("{cardId:guid}/payments/simulate")]
    public async Task<ActionResult<Guid>> SimulatePayment(
        Guid cardId,
        [FromBody] SimulateCardPaymentRequest request,
        [FromServices] SimulateCardPaymentCommandHandler handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(
            new SimulateCardPaymentCommand(
                cardId,
                request.Amount,
                request.Currency,
                request.Title),
            cancellationToken);

        return Ok(result);
    }

    [HttpPost("{cardId:guid}/repayment")]
    public async Task<ActionResult<Guid>> RepayCreditCard(
        Guid cardId,
        [FromServices] RepayCreditCardCommandHandler handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(
            new RepayCreditCardCommand(cardId),
            cancellationToken);

        return Ok(result);
    }
}
