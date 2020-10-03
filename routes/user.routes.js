const userController = require('../controller/user.controller');
const authentication = require('../middleware/authentication');

module.exports = (app) =>{

    app.post('/login', userController.login);
    app.post('/signup', userController.createAccount);

    app.use(authentication.verifyToken);
    app.get('/user', userController.getUserById);

}