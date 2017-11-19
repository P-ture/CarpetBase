import { toPairs } from 'ramda';
import connect from '../database';

/**
 * @method fetchMeta
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function fetchMeta(request, response) {

    const db = connect();
    const records = await db.select('key', 'value').from('meta');

    // Transform the array of records into a key value object.
    const transformedRecords = records.reduce((model, record) => {
        return { ...model, [record.key]: record.value };
    }, {});

    response.send(transformedRecords);

}

/**
 * @method updateMeta
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export async function updateMeta(request, response) {

    const db = connect();
    const records = await Promise.all(toPairs(request.body).map(async ([key, value]) => {

        try {

            // Update the meta table using the passed key.
            await db.table('meta').update({ value }).where('key', '=', key);

        } catch (err) {

            // Unable to save the page data due to an error, which we'll include in the response.
            response.send({ saved: false, error: err });

        }

    }));

    !response.headersSent && response.send({ saved: true, error: null });

}
