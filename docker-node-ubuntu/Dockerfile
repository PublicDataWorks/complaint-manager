#
# Ubuntu Node.js Dockerfile
#
# https://github.com/dockerfile/ubuntu/blob/master/Dockerfile
# https://docs.docker.com/examples/nodejs_web_app/
#

# Pull base image.

FROM ubuntu:14.04

LABEL version="1.0.0"

RUN apt-get update
RUN apt-get install --yes curl

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

RUN apt-get install --yes build-essential


RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

RUN sudo apt-get update && sudo apt-get install yarn

RUN apt-get install --yes fontconfig && \
 mkdir -p /usr/share && \
 cd /usr/share \
 && curl -L https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 | tar xj \
 && ln -s /usr/share/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/bin/phantomjs \
 && phantomjs --version

CMD ["node"]