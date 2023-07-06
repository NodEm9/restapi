const { Router } = require('express');
const router = Router();
const controller = require('../controllers/user.js');


// router.get('/', controller.getUsers);
// router.post('/', controller.createUser);
router.route('/')
    .get(controller.getUsers)
    .post(controller.createUser)

module.exports = router; 