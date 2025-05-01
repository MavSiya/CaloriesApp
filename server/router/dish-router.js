const Router = require('express').Router;
const dishController = require('../controllers/dish-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = new Router();

router.post('/create', authMiddleware, dishController.createDish);
router.delete('/:id', authMiddleware, dishController.deleteDish);
router.post('/add-ingredient', authMiddleware, dishController.addIngredient);
router.put('/update-ingredient', authMiddleware, dishController.updateIngredient);
router.delete('/remove-ingredient', authMiddleware, dishController.removeIngredient);
router.get('/all', authMiddleware, dishController.getAllDishes);
router.get('/search', authMiddleware, dishController.findDish);



module.exports = router;
