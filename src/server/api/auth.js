import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import connect from '../database';

/**
 * @method authenticate
 * @param {Object} request
 * @param {Object} response
 * @return {Promise} 
 */
export default async function authenticate(request, response) {

    const db = connect();
    const [{ username, password, salt }] = await db.select().from('users').where('username', request.query.username);
    const isValid = await argon2.verify(password, `${salt}${request.query.password}`);
    const token = jwt.sign({ username }, process.env.CARPETBASE_SECRET);

    return response.send({ authorised: isValid, token: isValid ? token : null });
    
}