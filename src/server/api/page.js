import { decamelizeKeys } from 'humps';
import { dissoc } from 'ramda';
import connect from '../database';
import { HOME } from '../../../src/js/reducers/page/actions';

/**
 * @method getOne
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function getOne(request, response) {

    const db = connect();

    // Fetch the content from the database by the passed slug.
    const [record] = await db.select().from('pages')
                             .where('slug', request.params.id || HOME).orWhere('id', request.params.id);

    // Fetch any galleries that ae associated with the page.
    const galleries = record ? await db.select().from('page_galleries').where('page_id', '=', record.id)
                              .innerJoin('galleries', 'galleries.id', 'page_galleries.gallery_id')
                              .orderBy('order', 'ASC') : [];

    record ? response.send({ ...record, galleries }) : response.status(404).send({});

}

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
        const [id] = await db.table('pages').insert(request.body);
        return response.send({ id: Number(id), saved: true, error: null });

    } catch (err) {

        // Likely it failed to create because the name already exists.
        return response.send({ saved: false, error: err });

    }

}

/**
 * @method getAll
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function getAll(request, response) {
    const db = connect();
    const records = await db.select().from('pages');
    response.send(records);
}

/**
 * @method update
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function update(request, response) {

    const db = connect();

    try {

        // Update the relevant page by the passed id.
        const model = dissoc('galleries')(request.body);
    
        // Determine if the current page is the homepage, in which case we'll not update its slug.
        const [{ slug }] = await db.select().from('pages').where('id', '=', request.params.id);
        const isHomepage = slug === HOME;

        // Update the page record.
        await db.table('pages')
                .update(isHomepage ? dissoc('slug')(model) : model)
                .where('id', '=', request.body.id);

        // Update the ordering of the associated gallery items.
        await db.table('page_galleries').where('page_id', '=', request.body.id).delete();
        await Promise.all(request.body.galleries.map(async ({ id }, order) => {

            // Insert the record with the required ordering.
            const model = { pageId: request.body.id, galleryId: id, order };
            return await db.table('page_galleries').insert(decamelizeKeys(model));

        }));

        return response.send({ saved: true, error: null });

    } catch (err) {

        // Unable to save the page due to an error, ehich we'll include in the response.
        return response.send({ saved: false, error: err.code === 1062 ? 'Page name already exists' : err });

    }

}

/**
 * @method del
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function del(request, response) {
    const db = connect();
    await db.table('pages').where('id', '=', request.params.id).delete();
    await db.table('page_galleries').where('page_id', '=', request.params.id).delete();
    response.send({ deleted: true });
}
