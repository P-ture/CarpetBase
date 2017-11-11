import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import setCookie from 'set-cookie';
import connect from '../database';

/**
 * @method fetchUser
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function fetchUser(request, response) {

    try {
        
        const db = connect();

        // Verify the JSON web token from the user's cookies.
        const record = jwt.verify(request.cookies.jwttoken, process.env.CARPETBASE_SECRET);
        const [{ id, username }] = await db.select().from('users').where('username', record.username);

        response.send({ id, username, authenticated: true });
    
    } catch (err) {

        // Otherwise the user is unauthenticated.
        response.send({ authenticated: false });

    }

} 

/**
 * @method authenticate
 * @param {Object} request
 * @param {Object} response
 * @return {Promise} 
 */
export async function authenticate(request, response) {

    const db = connect();
    
    try {

        // Gather the password and associated hashing salt based on the supplied username.
        const [{ username, password, salt }] = await db.select().from('users').where('username', request.body.username);
    
        // Verify their Argon2 hashed password with the salt, and sign the JWT.
        const isValid = await argon2.verify(password, `${salt}${request.body.password}`);
        const token = jwt.sign({ username }, process.env.CARPETBASE_SECRET);
    
        // Save the JWT to cookies if we have been successfully authenticated.
        isValid && setCookie('jwttoken', token, { res: response });
    
        return response.send({ authenticated: isValid, token: isValid ? token : null });

    } catch (err) {

        // Otherwise the supplied username doesn't have a record in the database.
        return response.send({ authenticated: false, token: null });

    }
    
}