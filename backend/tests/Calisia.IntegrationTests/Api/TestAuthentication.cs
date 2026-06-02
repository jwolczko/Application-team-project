using System.Net.Http.Headers;
using System.Text;
using Fortuna.Application.Abstractions.Clock;
using Fortuna.Infrastructure.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Fortuna.IntegrationTests.Api;

internal static class TestAuthentication
{
    private static readonly JwtOptions TestJwtOptions = new()
    {
        Issuer = "Calisia.IntegrationTests",
        Audience = "Calisia.IntegrationClient",
        SigningKey = "CalisiaIntegrationTestsSigningKey1234567890",
        ExpirationMinutes = 5
    };

    public static void Configure(IServiceCollection services)
    {
        services.Configure<JwtOptions>(options =>
        {
            options.Issuer = TestJwtOptions.Issuer;
            options.Audience = TestJwtOptions.Audience;
            options.SigningKey = TestJwtOptions.SigningKey;
            options.ExpirationMinutes = TestJwtOptions.ExpirationMinutes;
        });

        services.PostConfigure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ValidIssuer = TestJwtOptions.Issuer,
                ValidAudience = TestJwtOptions.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TestJwtOptions.SigningKey)),
                ClockSkew = TimeSpan.Zero
            };
        });
    }

    public static void Authorize(HttpClient client, Guid customerId, string email = "test@example.com")
    {
        var tokenProvider = new JwtTokenProvider(
            Options.Create(TestJwtOptions),
            new FixedDateTimeProvider());

        var token = tokenProvider.Create(customerId, email);

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.Token);
    }

    private sealed class FixedDateTimeProvider : IDateTimeProvider
    {
        public DateTime UtcNow => DateTime.UtcNow;
    }
}
