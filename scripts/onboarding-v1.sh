#!/bin/bash

# checks system architecture
function checks_system_arch() {
    architecture_type="$(uname -m)"

    if [ "$architecture_type" == "arm64" ]; then
        echo "ARM64"
    else
        echo "INTEL"
    fi 
}

# installs specific software
function downloads_docker() {
    local system_architecture="$(checks_system_arch)"
    
    cd ~/Downloads
    
    if [ "$system_architecture" == "ARM64" ]; then
        echo "Downloading docker.dmg..."
        curl -sOL https://desktop.docker.com/mac/main/arm64/Docker.dmg
        echo "Downloaded docker.dmg"
    else
        echo "Downloading docker.dmg..."
        curl -sOL https://desktop.docker.com/mac/main/amd64/Docker.dmg
        echo "Downloaded docker.dmg"
    fi
}

function downloads_postgres() {
    cd ~/Downloads
    echo "Downloading postgres.dmg version 16..."
    curl -sOL "https://github.com/PostgresApp/PostgresApp/releases/download/v2.7.2/Postgres-2.7.2-16.dmg"
    echo "Downloaded postgres.dmg"
}

function cleanup_vscode() {
    cd ~/Downloads
    echo "Unzipping vscode zip file..."
    unzip VSCode-darwin-universal.zip
    echo "Removing vscode zip file..."
    rm VSCode-darwin-universal.zip
}

function downloads_vscode() {
    cd ~/Downloads
    echo "Downloading vscode zip file..."
    curl -sOLJ "https://code.visualstudio.com/sha/download?build=stable&os=darwin-universal"
    echo "Downloaded vscode!"
}

function installs_brew() {
    echo "Installing brew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    echo "Brew installation complete!"
}

function installs_dbeaver() {
    echo "Installing dbeaver..."
    brew install --cask dbeaver-community
    echo "DBeaver installation complete!"
}

function installs_docker() {
    downloads_docker
    cd ~/Downloads
    echo "Beginning Docker installation..."
    sudo hdiutil attach Docker.dmg
    echo "This may take a few minutes..."
    sudo /Volumes/Docker/Docker.app/Contents/MacOS/install
    echo "Performing maintenance tasks..."
    sudo hdiutil detach /Volumes/Docker
    echo "Docker Installation complete..."
}

function installs_git() {
    echo "Installing git..."
    brew install git
}

function installs_mkcert() {
    echo "Installing mkcert..."
    brew install mkcert
}

function installs_nvm() {
    echo "Installing nvm..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh)"
}

function installs_postgres() {
    echo "Installing postgres..."
    downloads_postgres
    cd ~/Downloads
    echo "Beginning Postgres installation..."
    sudo hdiutil attach Postgres*.dmg
    echo "This may take a few minutes..."
    sudo cp -R /Volumes/Postgres-2.7.2-16/Postgres.app /Applications
    echo "Performing maintenance tasks..." 
    sudo hdiutil detach /Volumes/Postgres-2.7.2-16
    rm Postgres*.dmg
    echo "Postgres installation complete!"
}

function installs_vscode() {
    echo "Installing vscode..."
    downloads_vscode
    cleanup_vscode
    cd ~/Downloads
    mv "Visual Studio Code.app" /Applications/
    echo "Visual Studio Code installation complete!"
}

function installs_yarn() {
    echo "Installing yarn..."
    brew install yarn
    echo "Yarn installation complete!"
}

# checks if specific software is installed

function is_brew_installed() {
    local brew_command="$(which brew)"

    if [ "$brew_command" ]; then
        echo "brew is installed"
    else
        echo "brew is not installed"
        installs_brew
    fi
}

function is_dbeaver_installed() {
    local dbeaver_command="$(which dbeaver)"

    if [ "$dbeaver_command" ]; then
        echo "dbeaver is installed"
    else
        echo "dbeaver is not installed"
        installs_dbeaver
    fi
}

function is_docker_installed() {
    local docker_command="$(mdfind "kMDItemDisplayName == 'Docker'")"

    if [ "$docker_command" ]; then
        echo "docker desktop is installed"
    else
        echo "docker desktop is not installed"
        installs_docker
    fi
}

function is_git_installed() {
    local git_command="$(which git)"

    if [ "$git_command" ]; then
        echo "git is installed"
    else 
        echo "git is not installed"
        installs_git
    fi
}

function is_mkcert_installed() {
    local mkcert_command="$(which mkcert)"

    if [ "$mkcert_command" ]; then
        echo "mkcert is installed"
    else
        echo "mkcert is not installed"
        installs_mkcert
    fi
}

function is_nvm_installed() {
    local nvm_command="$(type -p nvm)"

    if [ -z "$nvm_command" ]; then
        echo "nvm is installed"
    else
        echo "nvm is not installed"
        installs_nvm
    fi
}

function is_postgres_installed() {
    local postgres_command="$(mdfind "kMDItemDisplayName == 'Postgres'")"

    if [ "$postgres_command" ]; then
        echo "postgresql is installed"
    else
        echo "postgresql in not installed"
        installs_postgres
    fi
}

function is_vscode_installed() {
    local vscode_command="$(mdfind "kMDItemDisplayName == 'Visual Studio Code'")"

    if [ "$vscode_command" ]; then
        echo "vscode is installed"
    else
        echo "vscode is not installed"
        installs_vscode
    fi
}

function is_yarn_installed() {
    local yarn_command="$(which yarn)"

    if [ "$yarn_command" ]; then
        echo "yarn is installed"
    else
        echo "yarn is not installed"
        installs_yarn
    fi
}

function check_installation() {

    is_brew_installed
    is_dbeaver_installed
    is_docker_installed
    is_git_installed
    is_mkcert_installed
    is_nvm_installed
    is_postgres_installed
    is_vscode_installed
    is_yarn_installed

}

check_installation
