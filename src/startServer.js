const app = require('./server/server');

app.listen(process.env.PORT || 1234, () => {
    console.log('Application is listening on port 1234');
    console.log('Please visit http://localhost:1234');
});