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
docker tag docker-node-ubuntu noipm/docker-node-ubuntu:<version>
```

### Pushing to DockerHub
```shell
docker push noipm/docker-node-ubuntu:<version>
```