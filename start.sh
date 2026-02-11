#!/bin/bash
set -e

export PATH="$PATH:/root/.dotnet"
cd out
dotnet MyPortfolio.dll
