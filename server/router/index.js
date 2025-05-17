import { Router } from 'express';
import userController from '../controllers/user-controller.js';
import userInfoController from '../controllers/user-info-controller.js';
import dishController from '../controllers/dish-controller.js';
import ingredientController from '../controllers/ingredient-controller.js';
import journalController from '../controllers/journal-controller.js';
import memberController from '../controllers/member-controller.js';
import menuController from '../controllers/menu-controller.js';


import {body} from 'express-validator';
import authMiddleware from '../middlewares/auth-middleware.js';
const router = new Router();

router.post('/registration', body('email').isEmail(),body('password').isLength({min:6, max:32}), userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware , userController.getUsers);

router.post(
  '/userInfo',authMiddleware,
  [
    body('activityId').isInt().withMessage('Некоректний ID активності'),
    body('goalId').isInt().withMessage('Некоректний ID цілі'),
    body('weight').isFloat().withMessage('Вага повинна бути числом'),
    body('height').isFloat().withMessage('Ріст повинен бути числом'),
    body('dateOfBirth').isDate().withMessage('Невірна дата народження'),
    body('sex').isIn(['male', 'female']).withMessage('Стать повинна бути або "male", або "female"'),
    body('name').isString().withMessage('Імʼя повинно бути рядком')
  ],
  userInfoController.createUserInfo
);
  
router.put(
  '/userInfo',
  authMiddleware,
  [
    body('activityId').optional().isInt().withMessage('Некоректний ID активності'),
    body('goalId').optional().isInt().withMessage('Некоректний ID цілі'),
    body('weight').optional().isFloat().withMessage('Вага повинна бути числом'),
    body('height').optional().isFloat().withMessage('Ріст повинен бути числом'),
    body('dateOfBirth').optional().isDate().withMessage('Невірна дата народження'),
    body('sex').optional().isIn(['male', 'female']).withMessage('Стать повинна бути male або female'),
    body('name').optional().isString().withMessage('Імʼя повинно бути рядком'),
  ],
  userInfoController.updateUserInfo
);

router.get('/userinfo', authMiddleware, userInfoController.getUserInfo);


//dish-controller
router.post('/create', authMiddleware, dishController.createDish);
router.delete('/dish/:id', authMiddleware, dishController.deleteDish);
router.post('/add-ingredient-todish', authMiddleware, dishController.addIngredient);
router.put('/update-ingredient', authMiddleware, dishController.updateIngredient);
router.delete('/remove-ingredient', authMiddleware, dishController.removeIngredient);
router.get('/all-dishes', authMiddleware, dishController.getAllDishes);
router.get('/all-dishes-bmr', authMiddleware, dishController.getAllDishesWithBmr);
router.get('/search-dish', authMiddleware, dishController.findDish);
router.get('/get-dish-type/:typeId', authMiddleware, dishController.getDishTypeById);
router.get('/get-all-dish-types', authMiddleware, dishController.getAllDishTypes);

//ingredient-controller
router.post('/add-ingredient-todb', authMiddleware, ingredientController.addIngredientToDB);
router.get('/search-ingredient', authMiddleware, ingredientController.findIngredient);

//journal-controller
router.post('/add-dish', authMiddleware, journalController.addDishToMeal);
router.post('/add-ingredient', authMiddleware, journalController.addIngredientToMeal);
router.delete('/delete/:journalDishId', authMiddleware, journalController.deleteFromMeal);
router.get('/meal-nutrients', authMiddleware, journalController.calculateMealNutrients);
router.get('/daily-nutrients', authMiddleware, journalController.calculateTotalDailyNutrients);
router.get('/target', authMiddleware, journalController.getDailyTarget);
router.get('/meal-dish', authMiddleware, journalController.getMealByDateAndType);

//member-controller
router.post('/create-member', authMiddleware,memberController.createMember);
router.post('/add-info',authMiddleware,  memberController.addMemberInfo);
router.delete('/:memberId', authMiddleware, memberController.deleteMember);
router.get('/all-member',authMiddleware,  memberController.getAllMembers);
router.get('/member/:memberId',authMiddleware,  memberController.getMemberById);
router.put('/update/:memberId',authMiddleware,  memberController.updateMemberInfo);
router.get('/info/:memberId',authMiddleware,  memberController.getMemberInfo);
router.get('/member-name/:memberId', authMiddleware, memberController.getMemberNameById);

//menu-controller
router.post('/add-in-menu',authMiddleware, menuController.addDishOrIngredientToMenu);
router.get('/menu', authMiddleware,menuController.getMenu);
router.delete('/menu/:mpwDishId', authMiddleware,menuController.deleteFromMenu);
router.put('/menu/:mpwDishId', authMiddleware,menuController.updateMenuItem);
router.get('/ingredients/aggregate', authMiddleware,menuController.getAggregatedIngredientsList);

export default router;