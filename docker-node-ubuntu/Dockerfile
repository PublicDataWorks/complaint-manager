#
# Ubuntu Node.js Dockerfile
#
# https://github.com/dockerfile/ubuntu/blob/master/Dockerfile
# https://docs.docker.com/examples/nodejs_web_app/
#

# Pull base image.
FROM ubuntu:18.04

LABEL version="1.0.1"
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install --yes curl
RUN apt-get install --yes build-essential

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install yarn

# Install PhantomJS
RUN apt-get install --yes fontconfig && \
    mkdir -p /usr/share && \
    cd /usr/share \
    && curl -L https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 | tar xj \
    && ln -s /usr/share/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/bin/phantomjs \
    && phantomjs --version

# Install PostgreSQL
RUN apt-get install -y postgresql

# Temporary fix from thread: https://github.com/nodesource/distributions/issues/1266
RUN apt-get install ca-certificates \
    && apt-get update \
    && apt-get install -y
RUN apt-get install bash; apt-get install libgnutls30

# Install AWS CLI
RUN apt-get install unzip
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip -q awscliv2.zip
RUN aws/install

CMD ["node"]