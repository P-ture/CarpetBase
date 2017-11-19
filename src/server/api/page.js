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

    // Fetch the content from the database by the passed slug.
    const [record] = await db.select().from('pages').where('slug', request.params.slug);
    record ? response.send(record) : response.status(404).send({});

}

/**
 * @method fetchPages
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function fetchPages(request, response) {
    const db = connect();
    const records = await db.select('slug', 'title').from('pages');
    response.send(records);
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

        // Update the relevant page by the passed slug.
        await db.table('pages').update(request.body).where('slug', '=', request.body.slug);
        return response.send({ saved: true, error: null });

    } catch (err) {

        // Unable to save the page due to an error, ehich we'll include in the response.
        return response.send({ saved: false, error: err });

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
}
