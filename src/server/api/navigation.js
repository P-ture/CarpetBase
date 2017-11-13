import connect from '../database';

/**
 * @method fetchNavigation
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export default async function fetchNavigation(request, response) {

    const db = connect();

    try {

        const records = await db.select().from('navigation').innerJoin('pages', 'pages.id', 'navigation.page_id');

        response.send(records);
    
    } catch (err) {

        response.send([]);

    } finally {
        db.destroy();
    }

}
