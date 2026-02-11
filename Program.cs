using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using MyPortfolio.Data;
using MyPortfolio.Hubs;
using MyPortfolio.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add DbContext (SQL Server). Uses DefaultConnection from appsettings.json.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add SignalR
builder.Services.AddSignalR();

// Register NotificationService
builder.Services.AddScoped<INotificationService, NotificationService>();

// Register EmailService
builder.Services.AddScoped<IEmailService, EmailService>();

// Register ProfanityFilterService
builder.Services.AddScoped<IProfanityFilterService, ProfanityFilterService>();

// Register RateLimitService (singleton for in-memory rate limiting)
builder.Services.AddSingleton<IRateLimitService, RateLimitService>();

// Configure forwarded headers for proxy/load balancer (Render uses this)
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// CORS: allow dev server and production domain
var allowedOrigins = builder.Environment.IsDevelopment()
    ? new[] { "http://localhost:3000", "https://localhost:3000" }
    : new[] { 
        "http://localhost:3000", 
        "https://localhost:3000",
        "https://all-about-b-d3azb7bjajhsc3b6.canadacentral-01.azurewebsites.net"
    };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong";
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true
    };
});

// Add SPA static files
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/build";
});

var app = builder.Build();

// Use forwarded headers from proxy/load balancer
app.UseForwardedHeaders();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Only redirect to HTTPS in production (Render handles SSL termination)
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Serve static files from wwwroot (including uploads)
app.UseStaticFiles();

// Serve SPA static files (CSS, JS, etc. from ClientApp/build)
app.UseSpaStaticFiles();

// Use CORS before endpoints that serve API
app.UseCors("AllowLocalhost");

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Map attribute routed API controllers
app.MapControllers();

// Map SignalR hub
app.MapHub<NotificationsHub>("/hubs/notifications");

// Keep conventional route for MVC views if any
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Configure SPA - but DON'T proxy API routes or static file uploads
app.MapWhen(context => 
    !context.Request.Path.StartsWithSegments("/api") && 
    !context.Request.Path.StartsWithSegments("/uploads"), 
    spaApp =>
{
    spaApp.UseSpa(spa =>
    {
        spa.Options.SourcePath = "ClientApp";

        if (app.Environment.IsDevelopment())
        {
            spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
        }
    });
});

app.Run();
