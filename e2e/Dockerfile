FROM kenfehling/node-selenium-chrome

WORKDIR /app
COPY package.json /app/
RUN npm install

COPY . /app/

ENTRYPOINT ["npm"]
CMD ["run", "e2e:local"]