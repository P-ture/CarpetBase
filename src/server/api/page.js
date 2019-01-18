import { rename } from 'fs';
import { decamelizeKeys, camelizeKeys } from 'humps';
import { dissoc } from 'ramda';
import connect from '../database';
import { HOME } from '../../../src/js/reducers/page/actions';
import { createDestination, removeFile } from '../media';

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
                             .where('slug', request.params.id || HOME).orWhere('pages.id', request.params.id);
    const model = camelizeKeys(record);

    // Fetch any galleries that ae associated with the page.
    const galleries = record ? await db.select('galleries.*', 'page_galleries.*', 'pages.slug')
                                       .from('page_galleries').where('page_id', '=', record.id)
                                       .innerJoin('galleries', 'galleries.id', 'page_galleries.gallery_id')
                                       .leftJoin('pages', 'pages.id', 'page_galleries.page_link_id')
                                       .orderBy('order', 'ASC') : [];

    // Fetch the page that is being linked to from the featured gallery.
    const [link] = (record && model.featuredPageId) ? await db.select('slug').from('pages').where('id', '=', model.featuredPageId) : [null];

    // Find the hero image if it has been set.
    const [hero] = (model && model.mediaId) ? await db.select().from('media').where('id', model.mediaId) : [null];

    record ? response.send({ ...record, hero, galleries, link }) : response.status(404).send({});

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
        await Promise.all(camelizeKeys(request.body.galleries).map(async ({ id, pageLinkId }, order) => {

            // Insert the record with the required ordering.
            const model = { pageId: request.body.id, galleryId: id, order, pageLinkId };
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
    await db.table('page_galleries').update(decamelizeKeys({ pageLinkId: null })).where('page_link_id', '=', request.params.id);
    response.send({ deleted: true });
}

/**
 * @method upload
 * @param {Object} request 
 * @param {Object} response 
 * @return {Promise}
 */
export async function upload(request, response) {

    const db = connect();
    
    try {

        const file = createDestination(request.file.originalname);

        rename(request.file.path, file.path, async err => {

            if (err) {
                response.send({ uploaded: false, error: err });
                return;
            }

            // Delete any existing media associated with the page.
            const [record] = await db.select('media_id AS mediaId', 'filename')
                                     .from('pages').innerJoin('media', 'media.id', 'pages.media_id')
                                     .where('pages.id', '=', Number(request.params.id));
            record && removeFile(record.filename);
            record && !Number.isNaN(record.mediaId) && await db.select().from('media').where('id', '=', record.mediaId).del();

            const [id] = await db.table('media').insert(decamelizeKeys({ filename: file.name }));
            const [image] = await db.select().from('media').where('id', '=', Number(id));
            await db.table('pages').update(decamelizeKeys({ mediaId: image.id })).where('id', '=', Number(request.params.id));
            response.send({ image, uploaded: true, error: null });

        });

    } catch (err) {

        // Include the reason for the failure in the response.
        response.send({ uploaded: false, error: err });

    }

}