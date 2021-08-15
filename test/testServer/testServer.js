const { promisify } = require('util');

exports.getAndStartTestServer = (port) => {
    const path = require('path');
    const express = require('express');
    const app = express();

    app.use(express.static(path.join(__dirname, '/public'), {
        extensions: ['html', 'html']
    }));

    app.get('/', (req, res) => {
        res.send('Hello World!')
    });

    return app.listen(port);
}
  
exports.stopServer = (server) => {
    server.close;
}