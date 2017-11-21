import connect from '../database';

/**
 * @method create
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function create(request, response) {
    
    const db = connect();

    try {

        // Create the page by the passed name, and ensure it's unique.
        await db.table('galleries').insert(request.body);
        return response.send({ saved: true, error: null });

    } catch (err) {

        // Likely it failed to create because the name already exists.
        return response.send({ saved: false, error: err });

    }

}

/**
 * @method get
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function get(request, response) {
    const db = connect();
    const [record] = await db.select().from('galleries').where('slug', '=', request.params.slug);
    return record ? response.send(record) : response.status(404).send({});
}
