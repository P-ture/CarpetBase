import { connect } from '../helpers/database';

/**
 * @method authenticate
 * @param {Object} request
 * @param {Object} response
 * @return {void} 
 */
export async function authenticate(request, response) {

    const client = connect();
    
    const user = await new Promise(resolve => {

        const sql = 'SELECT * FROM `users` WHERE username = :username AND password = :password LIMIT 1';

        client.query(sql, request.params, (err, [row]) => {
            console.log(row);
            resolve(row);
        });

    });

    return void response.send(user);
    
}