import connect from '../database';
import { HOME } from '../../../src/js/reducers/page/actions';

/**
 * @method fetchPage
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function fetchPage(request, response) {
    
    const db = connect();

    try {

        // Fetch the content from the database by the passed slug.
        const slug = request.params.slug === HOME ? null : request.params.slug;
        const [record] = await db.select().from('pages').where('slug', slug);
        return record ? response.send(record) : response.status(404).send({});

    } catch (err) {
        return response.send({});
    } finally {
        db.destroy();
    }

}

/**
 * @method fetchPages
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function fetchPages(request, response) {

    const db = connect();

    try {

        const records = await db.select('slug', 'title').from('pages');
        return response.send(records);

    } catch (err) {
        return response.send({});
    } finally {
        db.destroy();
    }

}

/**
 * @method updatePage
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function updatePage(request, response) {

    const db = connect();

    try {

        await db.table('pages').update(request.body).where('slug', '=', request.body.slug);
        return response.send({ saved: true });

    } catch (err) {
        console.log(err);
        return response.send({ saved: false, error: err });
    } finally {
        db.destroy();
    }

}

/**
 * @method fetchLayouts
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function fetchLayouts(request, response) {
    const db = connect();
    const records = await db.select().from('layouts');
    response.send(records);
    db.destroy();
}
