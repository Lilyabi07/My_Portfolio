# Build React client
FROM node:20-alpine AS clientbuild
WORKDIR /client
COPY ClientApp/package*.json ./
RUN npm ci
COPY ClientApp/ ./
RUN npm run build
 
# Build .NET app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY MyPortfolio.csproj ./
RUN dotnet restore
COPY . ./
# Copy built client into expected path
COPY --from=clientbuild /client/build ./ClientApp/build
RUN dotnet publish -c Release -o /app/publish

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish ./
# Ensure SPA static files are present
COPY --from=build /src/ClientApp/build ./ClientApp/build
CMD ["dotnet", "MyPortfolio.dll"]
