import connect from '../database';
import { HOME } from '../../../src/js/reducers/page/actions';

/**
 * @method fetchPage
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export default async function fetchPage(request, response) {

    const db = connect();

    try {

        // Fetch the content from the database by the passed slug.
        const slug = request.params.slug === 'home' ? null : request.params.slug;
        const [record] = await db.select().from('pages').where('slug', slug);
        return response.send(record);

    } catch (err) {
        return response.send({});
    }  finally {
        db.destroy();
    }

}
