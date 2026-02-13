using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using MyPortfolio.Data;
using MyPortfolio.Hubs;
using MyPortfolio.Services;
using System.Text;
using System.IO;
using Microsoft.Extensions.DependencyInjection;

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

// Apply pending migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        // Log migration errors but don't crash the app
        Console.WriteLine($"Migration error: {ex.Message}");
    }
}

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

// Serve uploads from a writable folder (Azure run-from-package is read-only)
var uploadsRoot = Path.Combine(Environment.GetEnvironmentVariable("HOME") ?? app.Environment.ContentRootPath, "uploads");
Directory.CreateDirectory(uploadsRoot);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsRoot),
    RequestPath = "/uploads"
});

// Serve SPA static files (CSS, JS, etc. from ClientApp/build)
app.UseSpaStaticFiles();

// Use CORS before endpoints that serve API
app.UseCors("AllowLocalhost");

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    // Map attribute routed API controllers
    endpoints.MapControllers();

    // Map SignalR hub
    endpoints.MapHub<NotificationsHub>("/hubs/notifications");
});

// Configure SPA - serve for all non-API, non-upload routes
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";
    spa.Options.DefaultPage = "/index.html";

    if (app.Environment.IsDevelopment())
    {
        spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
    }
});

app.Run();
