import connect from '../database';

/**
 * @method fetchMeta
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export default async function fetchMeta(request, response) {

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
