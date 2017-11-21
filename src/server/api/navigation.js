import connect from '../database';

/**
 * @method get
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function get(request, response) {
    const db = connect();
    const records = await db.select().from('navigation');
    response.send(records);
}
