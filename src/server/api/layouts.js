import connect from '../database';

/**
 * @method getAll
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function getAll(request, response) {
    const db = connect();
    const records = await db.select().from('layouts');
    response.send(records);
}
