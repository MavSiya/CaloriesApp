const Router = require('express').Router;
const userInfoController = require('../controllers/user-info-controller');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

const router = new Router();

// Роут для создания данных пользователя
router.post(
  '/user-info',
  authMiddleware,
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
router.post('/user-info', (req, res) => {
    res.send('Маршрут работает');
  });
  
// Роут для обновления данных пользователя
router.put(
  '/user-info',
  authMiddleware,
  [
    body('activityId').isInt().withMessage('Некоректний ID активності'),
    body('goalId').isInt().withMessage('Некоректний ID цілі'),
    body('weight').isFloat().withMessage('Вага повинна бути числом'),
    body('height').isFloat().withMessage('Ріст повинен бути числом'),
    body('dateOfBirth').isDate().withMessage('Невірна дата народження'),
    body('sex').isIn(['male', 'female']).withMessage('Стать повинна бути або "male", або "female"')
  ],
  userInfoController.updateUserInfo
);

// Роут для получения информации о пользователе
router.get('/user-info', authMiddleware, userInfoController.getUserInfo);

module.exports = router;
