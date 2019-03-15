# Build script to build app and keep yarn.lock up to date

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR
cd ..

echo "Building..."
docker-compose build

echo "Copying updated yarn.lock from container"
docker run --rm --entrypoint cat complaint_manager_app:latest /app/yarn.lock > yarn.lock

echo "Build complete"