import connect from '../database';

/**
 * @method fetchNavigation
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export default async function fetchNavigation(request, response) {
    const db = connect();
    const records = await db.select().from('navigation');
    response.send(records);
    db.destroy();
}
