import db from '../data-base/db.js';
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import mailService from './mail-service.js';
import tokenService from './token-service.js';
import UserDto from '../dtos/user-dto.js';
import ApiError from '../exceptions/api-error.js'


class UserService{
async registration(email, password){
    //Перевіряємо чи є такий користувач
   
    const [candidates] = await db.pool.query(
        'SELECT * FROM users WHERE email = ?', [email]
      );
  
      if (candidates.length > 0) {
        // Если пользователь с таким email уже существует, выбрасываем ошибку
        throw ApiError.BadRequest(`Користувач з такою поштою ${email} вже існує`);
      }

//Хешируємо пароль
const hashPassword = await bcrypt.hash(password, 3);
const activationLink = uuid.v4();
//Створюємо користувача
const [result] = await db.pool.query(
    'INSERT INTO users (email, password, activationLink) VALUES (?, ?, ?)',
    [email, hashPassword, activationLink]
);

const user = {
    id: result.insertId,
    email,
    password: hashPassword,
    isActivated: false,
    activationLink,
  };
  const userDto = new UserDto(user);
  //Відправляємо листа
await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

//Створюємо токени

const tokens = tokenService.generateTokens({ ...userDto });
await tokenService.saveToken(userDto.id, tokens.refreshToken);

return{...tokens, user: userDto}
}

async activate(activationLink){
  const [users] = await db.pool.query(
    'SELECT * FROM users WHERE activationLink = ?', 
    [activationLink]
  );
  if (users.length === 0) {
    throw ApiError.BadRequest('Некорректна активаційна силка');
  }

  await db.pool.query(
    'UPDATE users SET isActivated = true WHERE activationLink = ?', 
    [activationLink]
  );
}

async login(email, password){
  const [users] = await db.pool.query(
    'SELECT * FROM users WHERE email = ?', [email]
  );
  if (users.length === 0) {
    throw ApiError.BadRequest(`Користувач з такою поштою не знайдено`);
  }
  const user = users[0];

const isPassEquals = await bcrypt.compare(password, user.password);
if(!isPassEquals){
  throw ApiError.BadRequest(`Неправильний пароль`);
}

const userDto = new UserDto(user);
const tokens = tokenService.generateTokens({...userDto});
await tokenService.saveToken(userDto.id, tokens.refreshToken);

return{...tokens, user: userDto}
}


async logout(refreshToken){
  const token = await tokenService.removeToken(refreshToken);
  return token;
}

async refresh(refreshToken){
if (!refreshToken){
  throw ApiError.UnauthorizedError();
}
const userData = tokenService.validateRefreshToken(refreshToken);
const tokenFromDb = await tokenService.findToken(refreshToken);
if(!userData || !tokenFromDb){
  throw ApiError.UnauthorizedError();
}
const [users] = await db.pool.query(
  'SELECT * FROM users WHERE id = ?', [userData.id]
);
const user = users[0];
const userDto = new UserDto(user);
const tokens = tokenService.generateTokens({...userDto});

await tokenService.saveToken(userDto.id, tokens.refreshToken);
return{...tokens, user: userDto}
}

async getAllUsers(){
  const [users] = await db.pool.query(
    'SELECT * FROM users'
  );
  return users;
}

}

export default new UserService();