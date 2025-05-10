const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const userInfoController = require('../controllers/user-info-controller');
const dishController = require('../controllers/dish-controller');
const ingredientController = require('../controllers/ingredient-controller');
const journalController = require('../controllers/journal-controller');
const memberController = require('../controllers/member-controller');
const menuController = require('../controllers/menu-controller');


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
router.post('/create', authMiddleware, dishController.createDish); //done
router.delete('/dish/:id', authMiddleware, dishController.deleteDish);//done
router.post('/add-ingredient-todish', authMiddleware, dishController.addIngredient);//done
router.put('/update-ingredient', authMiddleware, dishController.updateIngredient);//done
router.delete('/remove-ingredient', authMiddleware, dishController.removeIngredient);
router.get('/all-dishes', authMiddleware, dishController.getAllDishes);//done
router.get('/all-dishes-bmr', authMiddleware, dishController.getAllDishesWithBmr);//done
router.get('/search-dish', authMiddleware, dishController.findDish);//done
router.get('/get-dish-type/:typeId', authMiddleware, dishController.getDishTypeById);//done
router.get('/get-all-dish-types', authMiddleware, dishController.getAllDishTypes);//done

//ingredient-controller
router.get('/add-ingredient-todb', authMiddleware, ingredientController.addIngredientToDB);
router.get('/search-ingredient', authMiddleware, ingredientController.findIngredient);

//journal-controller
router.post('/add-dish', authMiddleware, journalController.addDishToMeal);//done
router.post('/add-ingredient', authMiddleware, journalController.addIngredientToMeal);//done
router.delete('/delete/:journalDishId', authMiddleware, journalController.deleteFromMeal);//done
router.get('/meal-nutrients', authMiddleware, journalController.calculateMealNutrients);//done
router.get('/daily-nutrients', authMiddleware, journalController.calculateTotalDailyNutrients);//done
router.get('/target', authMiddleware, journalController.getDailyTarget);
router.get('/meal-dish', authMiddleware, journalController.getMealByDateAndType);//done


//member-controller
router.post('/create-member', authMiddleware,memberController.createMember);//done
router.post('/add-info',authMiddleware,  memberController.addMemberInfo);//done
router.delete('/:memberId', authMiddleware, memberController.deleteMember);
router.get('/all-member',authMiddleware,  memberController.getAllMembers);//done
router.get('/member/:memberId',authMiddleware,  memberController.getMemberById);//done
router.put('/update/:memberId',authMiddleware,  memberController.updateMemberInfo);//done
router.get('/info/:memberId',authMiddleware,  memberController.getMemberInfo);//done

////menu-controller
router.post('/add-in-menu',authMiddleware, menuController.addDishOrIngredientToMenu);//done
router.get('/menu', authMiddleware,menuController.getMenu);//done
router.delete('/menu/:mpwDishId', authMiddleware,menuController.deleteFromMenu);//done
router.put('/menu/:mpwDishId', authMiddleware,menuController.updateMenuItem);//done
router.get('/ingredients/aggregate', authMiddleware,menuController.getAggregatedIngredientsList);//done

module.exports = router