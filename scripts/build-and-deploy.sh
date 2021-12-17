#!/bin/bash

# Inputs
#- Version
#- Instance Files Location (Previous Version or Codebase Directory)
#- Heroku Keys for Deployment
#- Database Credentials for Migrations
#- AWS Keys
#- Google Maps API Keys

# Steps
#1. Build Versioned Instance Files locally (if based on locally cloned codebase)
#2. Build Versioned App Images locally (Web and Worker)
#3. Migrate and Seed Database
#4. Deploy Web and Worker containers to Heroku
#5. Ensure Deploy Succeeded in Cloud env
#6. Hints for consumers like tagging, pushing to Docker, etc.
source $1

echo $HEROKU_APP_NAME