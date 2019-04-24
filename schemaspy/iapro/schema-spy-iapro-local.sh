# Script to generate schemaspy output for locally running iapro database

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR
cd ..

read -s -p "Enter password for database: " password

docker run -v "$DIR/output:/output" -v "$DIR/drivers:/drivers" schemaspy/schemaspy -t mssql05 -db master -s IA_ADM -host docker.for.mac.host.internal -port 1433 -u sa -p $password

