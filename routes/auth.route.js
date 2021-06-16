const {Router} = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

router
  .route('/signup')
  .get(authController.signup_get)
  .post(authController.signup_post);

router
  .route('/login')
  .get(authController.login_get)
  .post(authController.login_post);

router
  .route('/logout')
  .get(authController.logout_get);

router.get('/verify', authController.verify_get);

module.exports = router;
