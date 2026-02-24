# My Portfolio

Dynamic portfolio website with a React (Vite) frontend and ASP.NET Core backend, including an authenticated admin panel and bilingual content support (English/French).

## Tech Stack

- Backend: ASP.NET Core 8 Web API + MVC hosting
- Frontend: React 18 + TypeScript + Vite
- Database: SQL Server (Entity Framework Core)
- Realtime admin updates: SignalR
- Deployment target: Azure App Service

## Core Features

- Public portfolio pages driven by database content
- Admin authentication + CRUD management for portfolio sections
- Bilingual content fields (EN/FR)
- Contact form submissions saved to database and sent via SMTP email
- Spam protection on contact form:
   - Cloudflare Turnstile verification
   - IP rate limiting
   - Hidden honeypot field
   - Minimum fill-time check
   - Profanity filtering

## Project Structure

- `ClientApp/` React frontend
- `Controllers/` API and admin endpoints
- `Services/` business logic (email, anti-spam, notifications)
- `Data/` EF Core DbContext
- `Migrations/` EF Core migrations

## Local Setup

### Prerequisites

- .NET 8 SDK
- Node.js 18+
- SQL Server LocalDB (or SQL Server)

### 1) Clone and install

```bash
git clone https://github.com/Lilyabi07/My_Portfolio.git
cd My_Portfolio
cd ClientApp
npm install
cd ..
```

### 2) Configure backend secrets (`appsettings.Development.json`)

Set the values below in your local (gitignored) `appsettings.Development.json`:

```json
{
   "ConnectionStrings": {
      "DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=MyPortfolioDb;Integrated Security=True;TrustServerCertificate=True;"
   },
   "Admin": {
      "Username": "admin",
      "Password": "your-admin-password"
   },
   "Jwt": {
      "Key": "your-32+char-jwt-key",
      "Issuer": "MyPortfolio",
      "Audience": "MyPortfolioUsers"
   },
   "Email": {
      "SmtpHost": "smtp.gmail.com",
      "SmtpPort": "587",
      "SmtpUsername": "your-email@example.com",
      "SmtpPassword": "your-provider-app-password",
      "FromEmail": "your-email@example.com",
      "RecipientEmail": "your-email@example.com"
   },
   "Turnstile": {
      "SecretKey": "your-turnstile-secret-key"
   }
}
```

### 3) Configure frontend Turnstile key (`ClientApp/.env.local`)

Create `ClientApp/.env.local` (gitignored):

```env
VITE_TURNSTILE_SITE_KEY=your-turnstile-site-key
```

### 4) Apply database migrations

```bash
dotnet ef database update --project MyPortfolio.csproj --startup-project MyPortfolio.csproj
```

### 5) Run locally

Backend (from repo root):

```bash
dotnet run
```

Frontend (from `ClientApp/`):

```bash
npm run dev
```

Expected local URLs:

- Frontend: `http://localhost:3000`
- Backend: shown by `dotnet run` output (for example `https://localhost:58272`)

## SMTP Contact Email Configuration (Gmail or Yahoo)

Contact form emails are sent by `Services/EmailService.cs` using these keys:

- `Email:SmtpHost`
- `Email:SmtpPort`
- `Email:SmtpUsername`
- `Email:SmtpPassword`
- `Email:FromEmail`
- `Email:RecipientEmail`

### Gmail values

- `Email:SmtpHost` = `smtp.gmail.com`
- `Email:SmtpPort` = `587`
- `Email:SmtpUsername` = your full Gmail address
- `Email:SmtpPassword` = Google App Password
- `Email:FromEmail` = usually same Gmail address
- `Email:RecipientEmail` = inbox to receive contact form messages

### Yahoo values

- `Email:SmtpHost` = `smtp.mail.yahoo.com`
- `Email:SmtpPort` = `587`
- `Email:SmtpUsername` = your full Yahoo address
- `Email:SmtpPassword` = Yahoo App Password
- `Email:FromEmail` = usually same Yahoo address
- `Email:RecipientEmail` = inbox to receive contact form messages

Both Gmail and Yahoo require an app password generated from the provider account security settings.

## Cloudflare Turnstile Configuration

1. Create a widget in Cloudflare Turnstile (Managed mode recommended).
2. Add allowed hostnames (for example `localhost` and your production host).
3. Put the Site Key in `ClientApp/.env.local` as `VITE_TURNSTILE_SITE_KEY`.
4. Put the Secret Key in backend config as `Turnstile:SecretKey`.

## Production (Azure) Settings

Set these Application Settings in Azure App Service:

- `ConnectionStrings__DefaultConnection`
- `Admin__Username`
- `Admin__Password`
- `Jwt__Key`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Email__SmtpHost` = `smtp.gmail.com` or `smtp.mail.yahoo.com`
- `Email__SmtpPort` = `587`
- `Email__SmtpUsername`
- `Email__SmtpPassword`
- `Email__FromEmail`
- `Email__RecipientEmail`
- `Turnstile__SecretKey`

For the frontend build/deploy, provide:

- `VITE_TURNSTILE_SITE_KEY`

## Notes

- Do not commit `.env.local` or secret-bearing appsettings files.
- `appsettings.json` and `ClientApp/.env.example` should contain placeholders only.

