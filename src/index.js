const app = require('./app')
const port = process.env.PORT
log = console.log

app.listen(port, () => log('Server is up on port: ' + port))