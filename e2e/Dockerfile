#Container with package json dependencies installed
FROM kenfehling/node-selenium-chrome

WORKDIR /app
COPY package.json /app/
RUN npm install

COPY . /app/

ENTRYPOINT ["npm", "run"]
CMD ["e2e:local"]

##Container with just nightwatch
#FROM kenfehling/node-selenium-chrome
#
#WORKDIR /app
#COPY package.json /app/
#RUN npm install
#
#COPY . /app/
#
#ENTRYPOINT ["npm", "run"]
#CMD ["e2e:local"]