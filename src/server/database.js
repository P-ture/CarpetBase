import Client from 'mariasql';
import { parse } from 'pg-connection-string';

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
    return new Client({ ...credentials, db: credentials.database, charset: 'utf8' });
}
