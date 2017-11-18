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

    try {

        const records = await db.select('key', 'value').from('meta');
        response.send(records.reduce((model, record) => {
            return { ...model, [record.key]: record.value };
        }, {}));

    } catch (err) {

        response.send([]);

    } finally {
        db.destroy();
    }

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
            return await db.table('meta').update({ value }).where('key', '=', key);
        } catch (err) {
            response.send({ saved: false, error: err });
        }

    }));

    return response.send({ saved: true });

}
