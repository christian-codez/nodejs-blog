const config = require('config')

const startApp = (app) => {
    const port = process.env.PORT || config.get("port");
    return app.listen(port, () => console.log(`Example app listening on port ${port}`));
}

module.exports = startApp;