using Fortuna.Application.Accounts.Commands.DepositMoney;
using Fortuna.Application.Accounts.Commands.OpenBankAccount;
using Fortuna.Application.Accounts.Commands.WithdrawMoney;
using Fortuna.Application.Customers.Commands.LoginCustomer;
using Fortuna.Application.Customers.Commands.RegisterCustomer;
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

        return services;
    }
}
