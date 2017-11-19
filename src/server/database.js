import knex from 'knex';
import parse from 'pg-connection-string';
import { once } from 'ramda';

/**
 * @constant credentials
 * @type {Object}
 */
const credentials = parse(process.env.CARPETBASE_DB);

/**
 * @method connect
 * @return {Object}
 */
export default once(() => {

    return knex({
        dialect: 'maria',
        connection: {
            ...credentials, db: credentials.database
        },
        pool: { min: 0, max: 5 }
    });

});
