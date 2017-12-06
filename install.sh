#!/usr/bin/env bash

# function to run a command as the vagrant user
as_vagrant () {
  sudo -i -u vagrant bash -c "$1"
}
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install git -y
echo 'create src dir...'
as_vagrant 'mkdir ~/src'
echo 'install chruby...'
as_vagrant 'git clone https://github.com/postmodern/chruby.git ~/src/chruby'
as_vagrant 'cd ~/src/chruby && sudo make install'
# echo to .profile as it is read by sudo -i (unlike .bashrc)
as_vagrant "echo 'source /usr/local/share/chruby/chruby.sh' >> ~/.profile"
as_vagrant "echo 'source /usr/local/share/chruby/auto.sh' >> ~/.profile"
echo 'install ruby-install...'
as_vagrant 'git clone https://github.com/postmodern/ruby-install.git ~/src/ruby-install'
as_vagrant 'cd ~/src/ruby-install && sudo make install'
echo 'install rubyies...'
as_vagrant 'ruby-install ruby 2.4.1'
echo 'set default ruby...'
as_vagrant "echo '2.4.1' > .ruby-version"
echo 'gem install bundler...'
as_vagrant 'gem install bundler'

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
