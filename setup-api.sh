#!/bin/bash

# PROD or DEV
export ASTRA_DB_ENV="PROD"
export ASTRA_DB_ID="<change_me>"
export ASTRA_DB_REGION="<change_me>"
export ASTRA_DB_APPLICATION_TOKEN="<change_me>"

if [ "$ASTRA_DB_ENV" = "PROD" ]; then
    export ASTRA_DB_API_ENDPOINT="https://$ASTRA_DB_ID-$ASTRA_DB_REGION.apps.astra.datastax.com"
elif [ "$ASTRA_DB_ENV" = "DEV" ]; then
    export ASTRA_DB_API_ENDPOINT="https://$ASTRA_DB_ID-$ASTRA_DB_REGION.apps.astra-dev.datastax.com"
else
    echo "Error: Unknown ASTRA_DB_ENV value"
fi

clear
echo -e "\033[32m\n[$ASTRA_DB_ENV]\033[0m"
echo -e "\033[33mASTRA_DB_ID=\033[0m$ASTRA_DB_ID"
echo -e "\033[33mASTRA_DB_APPLICATION_TOKEN=\033[0m$ASTRA_DB_APPLICATION_TOKEN"
echo -e "\033[33mASTRA_DB_API_ENDPOINT=\033[0m$ASTRA_DB_API_ENDPOINT"

echo -e "\033[32m\n[DB DESCRIPTION]\033[0m"
astra db describe $ASTRA_DB_ID

echo -e "\033[32m[COLLECTION LIST]\033[0m"
astra db list-collections $ASTRA_DB_ID
