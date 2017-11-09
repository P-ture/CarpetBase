import knex from 'knex';
import parse from 'pg-connection-string';

/**
 * @constant credentials
 * @type {Object}
 */
const credentials = parse(process.env.CARPETBASE_DB);

/**
 * @method connect
 * @return {Object}
 */
export default function connect() {

    return knex({
        dialect: 'maria',
        connection: {
            ...credentials, db: credentials.database
        }
    });

}
