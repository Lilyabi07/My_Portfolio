# ASP.NET MVC + React Portfolio

This project combines ASP.NET MVC backend with a React frontend.

## Technologies

### Backend
- **ASP.NET Core 8.0** - Modern web framework
- **Entity Framework Core** - ORM for database access
- **C#** - Primary backend language
- **SQL Server/MySQL** - Database

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Bootstrap 5** - CSS framework
- **Axios** - HTTP client

## Project Structure

```
MyPortfolio/
├── Controllers/           # ASP.NET MVC Controllers
├── Models/               # Data models
├── Views/                # Razor views
├── ClientApp/            # React frontend
│   ├── public/          # Static files
│   └── src/             # React source code
│       ├── components/  # React components
│       ├── App.tsx      # Main App component
│       └── index.tsx    # Entry point
├── wwwroot/             # Static files served by ASP.NET
├── appsettings.json     # Configuration
├── Program.cs           # Application startup
└── MyPortfolio.csproj   # Project file
```

## Setup Instructions

### Prerequisites
- .NET 8.0 SDK or later
- Node.js 18+ and npm
- SQL Server or MySQL

### Backend Setup

1. **Restore .NET packages**
   ```bash
   dotnet restore
   ```

2. **Update database connection**
   Edit `appsettings.json` and update the connection string.
   
   For Windows Authentication:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=portfolio_db;Integrated Security=true;TrustServerCertificate=true;"
   }
   ```
   
   For SQL Server Authentication (use environment variables or user secrets):
   ```bash
   dotnet user-secrets init
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=portfolio_db;User Id=your_username;Password=your_password;TrustServerCertificate=true;"
   ```

3. **Run migrations** (if using Entity Framework)
   ```bash
   dotnet ef database update
   ```

4. **Build the project**
   ```bash
   dotnet build
   ```

### Frontend Setup

1. **Install npm packages**
   ```bash
   npm install
   ```

2. **Start React development server**
   ```bash
   npm start
   ```
   This starts the React app on http://localhost:3000

### Running the Application

#### Development Mode

Terminal 1 - ASP.NET Backend:
```bash
dotnet run
```
This starts the API on http://localhost:5000

Terminal 2 - React Frontend:
```bash
npm start
```
This starts React dev server on http://localhost:3000

#### Production Build

1. **Build React app**
   ```bash
   npm run build
   ```

2. **Run ASP.NET with built React app**
   ```bash
   dotnet run --configuration Release
   ```

The ASP.NET server will serve the built React app.

## API Endpoints

- `GET /api/portfolio/skills` - Get all skills
- `GET /api/portfolio/projects` - Get all projects

## Development

### Adding New Features

1. **Backend**: Add controllers in `Controllers/` and models in `Models/`
2. **Frontend**: Add React components in `ClientApp/src/components/`
3. **API Integration**: Use axios in React components to call ASP.NET API endpoints

### Code Structure

- **Controllers**: Handle HTTP requests and return data
- **Models**: Define data structures
- **React Components**: Build UI with TypeScript
- **API Calls**: Made using axios with proxy to backend

## Database

The project uses the same database schema as the PHP version:
- `skills` table
- `projects` table  
- `work_experience` table
- `users` table

Connection string in `appsettings.json` should point to your database.

## Deployment

### IIS Deployment

1. Build for production:
   ```bash
   npm run build
   dotnet publish -c Release
   ```

2. Copy published files to IIS

3. Ensure `web.config` is properly configured

### Docker Deployment

Create a Dockerfile for containerized deployment (optional).

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
