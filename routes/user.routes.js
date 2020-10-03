const userController = require('../controller/user.controller');
const authentication = require('../middleware/authentication');

module.exports = (app) =>{

    const cors = require('cors');
    const corsOptions = {
        origin: "https://angular-9-chat-app.web.app"
    };
    app.use(cors(corsOptions));

    app.post('/login', userController.login);
    app.post('/signup', userController.createAccount);

    app.use(authentication.verifyToken);
    app.get('/user', userController.getUserById);

}