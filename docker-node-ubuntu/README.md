### Logging In to DockerHub
```shell
docker login
```

### Building DockerFile

```shell
docker build -t docker-node-ubuntu .
```

### Tagging Docker Image
```shell
docker tag docker-node-ubuntu publicdataworks/docker-node-ubuntu:<version>
```

### Pushing to DockerHub
```shell
docker push publicdataworks/docker-node-ubuntu:<version>
```