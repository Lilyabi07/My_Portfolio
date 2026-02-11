#!/bin/bash
set -e

echo "Building .NET application..."
dotnet publish -c Release -o out

echo "Build complete!"
 