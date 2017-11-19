import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import setCookie from 'set-cookie';
import connect from '../database';

/**
 * @method isAuthenticated
 * @param {Object} cookies
 * @return {Boolean}
 */
export function isAuthenticated(cookies) {

    try {
        return Boolean(jwt.verify(cookies.jwttoken, process.env.CARPETBASE_SECRET));
    } catch (err) {
        return false;
    }

}

/**
 * @method authenticated
 * @param {Function} action
 * @return {void}
 */
export function authenticated(action) {

    return (request, response) => {

        // Only invoke the action if the user is authenticated, otherwise respond with a 403.
        isAuthenticated(request.cookies) ? action(request, response) :
                                           response.status(403).send({ authenticated: false });
        
    };

}

/**
 * @method fetchUser
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function fetchUser(request, response) {

    const db = connect();

    try {

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

        // Verify their Argon2 ha   shed password with the salt, and sign the JWT.
        const isValid = await argon2.verify(password, `${salt}${request.body.password}`);
        const token = jwt.sign({ username }, process.env.CARPETBASE_SECRET, {
            expiresIn: '7d'
        });

        // Save the JWT to cookies if we have been successfully authenticated.
        isValid && setCookie('jwttoken', token, { res: response, path: '/' });

        return response.redirect(isValid ? '/admin/dashboard.html' : '/admin/login.html?error=invalid');

    } catch (err) {

        // Otherwise the supplied username doesn't have a record in the database.
        response.redirect('/admin/login.html?error=invalid');

    }

}
