const Router = require('express').Router;
const userController = require('../controllers/user-controller');
//const userInfoRouter = require('./user-info-router'); 
const userInfoController = require('../controllers/user-info-controller');

const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const router = new Router();

router.post('/registration', body('email').isEmail(),body('password').isLength({min:6, max:32}), userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware , userController.getUsers);



router.post(
  '/userInfo'
  [
    body('activityId').isInt().withMessage('Некоректний ID активності'),
    body('goalId').isInt().withMessage('Некоректний ID цілі'),
    body('weight').isFloat().withMessage('Вага повинна бути числом'),
    body('height').isFloat().withMessage('Ріст повинен бути числом'),
    body('dateOfBirth').isDate().withMessage('Невірна дата народження'),
    body('sex').isIn(['male', 'female']).withMessage('Стать повинна бути або "male", або "female"')
  ],
  userInfoController.createUserInfo
);
  
// Роут для обновления данных пользователя
router.put(
  '/userInfo',
  authMiddleware,
  [
    body('activityId').optional().isInt().withMessage('Некоректний ID активності'),
    body('goalId').optional().isInt().withMessage('Некоректний ID цілі'),
    body('weight').optional().isFloat().withMessage('Вага повинна бути числом'),
    body('height').optional().isFloat().withMessage('Ріст повинен бути числом'),
    body('dateOfBirth').optional().isDate().withMessage('Невірна дата народження')
  ],
  userInfoController.updateUserInfo
);

// Роут для получения информации о пользователе
router.get('/userinfo', authMiddleware, userInfoController.getUserInfo);


module.exports = router