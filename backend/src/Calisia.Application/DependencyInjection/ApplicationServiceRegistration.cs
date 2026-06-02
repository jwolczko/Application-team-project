using Fortuna.Application.Accounts.Commands.DepositMoney;
using Fortuna.Application.Accounts.Commands.OpenBankAccount;
using Fortuna.Application.Accounts.Commands.WithdrawMoney;
using Fortuna.Application.Cards.Commands.RepayCreditCard;
using Fortuna.Application.Cards.Commands.SimulateCardPayment;
using Fortuna.Application.Customers.Commands.LoginCustomer;
using Fortuna.Application.Customers.Commands.RegisterCustomer;
using Fortuna.Application.Dashboard.Queries.GetDashboard;
using Fortuna.Application.Products.Commands.AddProduct;
using Fortuna.Application.Products.Commands.RepayCashLoan;
using Fortuna.Application.Transfers.Commands.CreateTransfer;
using Microsoft.Extensions.DependencyInjection;

namespace Fortuna.Application.DependencyInjection;

public static class ApplicationServiceRegistration
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<RegisterCustomerCommandHandler>();
        services.AddScoped<LoginCustomerCommandHandler>();
        services.AddScoped<OpenBankAccountCommandHandler>();
        services.AddScoped<DepositMoneyCommandHandler>();
        services.AddScoped<WithdrawMoneyCommandHandler>();
        services.AddScoped<SimulateCardPaymentCommandHandler>();
        services.AddScoped<RepayCreditCardCommandHandler>();
        services.AddScoped<AddProductCommandHandler>();
        services.AddScoped<RepayCashLoanCommandHandler>();
        services.AddScoped<CreateTransferCommandHandler>();
        services.AddScoped<GetDashboardQueryHandler>();

        return services;
    }
}
