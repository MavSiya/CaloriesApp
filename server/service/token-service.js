import jwt from 'jsonwebtoken';
import db from '../data-base/db.js';

class TokenService{
  
generateTokens(payload){
const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '60m'})
const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '60d'})
return{
    accessToken,
    refreshToken
}
}

validateAccessToken(token){
  try{
const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
return userData;
  }catch(e){
return null;
  }

}

validateRefreshToken(token){
  try{
    const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
return userData;
  }catch(e){

  }

}

async saveToken(userId, refreshToken) {
  
    const [rows] = await db.pool.query('SELECT * FROM tokens WHERE userId = ?', [userId]);

    if (rows.length > 0) {
      await db.pool.query('UPDATE tokens SET refreshToken = ? WHERE userId = ?', [refreshToken, userId]);
      return { userId, refreshToken };
    } else {
      await db.pool.query('INSERT INTO tokens (userId, refreshToken) VALUES (?, ?)', [userId, refreshToken]);
      return { userId, refreshToken };
    }
  }

  async removeToken(refreshToken){
    console.log('Токен для видалення:', refreshToken);
    const [tokenData] = await db.pool.query('DELETE FROM tokens WHERE refreshToken = ?', [refreshToken]);
    console.log('Deleted rows:', tokenData.affectedRows); // <= Додай це
    return tokenData;
  }

  async findToken(refreshToken){
    const [tokenData] = await db.pool.query('SELECT * FROM tokens WHERE refreshToken = ?', [refreshToken]);
    return tokenData;
  }
}

export default new TokenService();