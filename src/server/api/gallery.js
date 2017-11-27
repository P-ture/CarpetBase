import { camelizeKeys, decamelizeKeys } from 'humps';
import { dissoc } from 'ramda';
import cloudinary from '../cdn';
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
        const [id] = await db.table('galleries').insert(request.body);
        return response.send({ id: Number(id), saved: true, error: null });

    } catch (err) {

        // Likely it failed to create because the name already exists.
        return response.send({ saved: false, error: err });

    }

}

/**
 * @method getOne
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function getOne(request, response) {

    const db = connect();
    const [record] = await db.select().from('galleries').where('id', '=', Number(request.params.id));

    return record ? (async () => {

        // Attempt to find the associated media if we have a record.
        const media = await db.select().from('galleries_media')
                              .innerJoin('media', 'galleries_media.media_id', 'media.id')
                              .where('galleries_media.gallery_id', '=', record.id).orderBy('galleries_media.order', 'ASC');
        response.send({ ...record, media });

    })() : response.status(404).send({});

}

/**
 * @method getAll
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function getAll(request, response) {
    const db = connect();
    const records = await db.select().from('galleries');
    return response.send(records);
}

/**
 * @method upload
 * @param {Object} request 
 * @param {Object} response 
 * @return {Promise}
 */
export async function upload(request, response) {
    
    try {
        
        const db = connect();
        
        cloudinary.uploader.upload(request.file.path, async result => { 

            const media = camelizeKeys(result);

            // Insert into the media table and the joining table that links them to the relevant gallery.
            const [id] = await db.table('media').insert(decamelizeKeys({ url: media.url, publicId: media.publicId }));
            await db.table('galleries_media').insert(decamelizeKeys({ mediaId: Number(id), galleryId: request.params.id }));

            // Find the image model that was just uploaded.
            const [image] = await db.select().from('media').where('id', '=', Number(id));

            response.send({ image, uploaded: true, error: null });
    
        });

    } catch (err) {

        // Include the reason for the failure in the response.
        response.send({ uploaded: false, error: err });

    }

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

        // Update the relevant gallery by the passed id.
        await db.table('galleries').update(dissoc('media')(request.body)).where('id', '=', request.body.id);

        // Update the ordering of the associated media items.
        const order = request.body.media.map(model => model.id);
        await Promise.all(order.map((id, order) => db.table('galleries_media').update({ order }).where('media_id', '=', id)));

        return response.send({ saved: true, error: null });

    } catch (err) {

        // Unable to save the gallery due to an error, which we'll include in the response.
        return response.send({ saved: false, error: err });

    }

}

/**
 * @method delAll
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function delAll(request, response) {

    const db = connect();

    const records = await db.select().from('media').where('gallery_id', '=', Number(request.params.id));
    const models = camelizeKeys(records);

    // Delete all of the media items associated to the gallery.
    await models.map(async model => {
        cloudinary.uploader.destroy(model.publicId);
        await db.table('media').where('id', '=', Number(model.id)).delete();
        await db.table('galleries_media').where('media_id', '=', Number(model.id)).delete();
    });

    await db.table('galleries').where('id', '=', Number(request.params.id)).delete();
    await db.table('page_galleries').where('gallery_id', '=', Number(request.params.id)).delete();
    await db.table('pages').update(decamelizeKeys({ featuredGalleryId: null }))
                           .where(decamelizeKeys({ featuredGalleryId: request.params.id }));
    response.send({ deleted: true });

}

/**
 * @method delOne
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function delOne(request, response) {

    const db = connect();
    const [record] = await db.select().from('media').where('id', '=', Number(request.params.id));
    const model = camelizeKeys(record);

    // Remove the media item from the database.
    await db.table('media').where('id', '=', Number(request.params.id)).delete();
    await db.table('galleries_media').where('media_id', '=', Number(request.params.id)).delete();
    await db.table('pages').update(decamelizeKeys({ mediaId: null })).where('media_id', '=', Number(request.params.id));
    await db.table('pages').update(decamelizeKeys({ featuredGalleryId: null }))
                           .where(decamelizeKeys({ featuredGalleryId: request.params.id }));

    // Finally attempt to delete the media item from the Cloundinary service.
    cloudinary.uploader.destroy(model.publicId, ({ result }) => response.send({ deleted: result === 'ok' }));

}
