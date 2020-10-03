const userController = require('../controller/user.controller');
const authentication = require('../middleware/authentication');
let cors = require('cors');

module.exports = (app) =>{

    app.use(cors());
    app.post('/login', userController.login);
    app.post('/signup', userController.createAccount);

    app.use(authentication.verifyToken);
    app.get('/user', userController.getUserById);

}