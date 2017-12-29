import { extname, resolve, sep } from 'path';
import { unlink } from 'fs';
import { identity } from 'ramda';
import { generate } from 'shortid';

/**
 * @constant path
 * @type {String}
 */
export const path = resolve('public/assets/media');

/**
 * @method createDestination
 * @param {String} filename
 * @return {String}
 */
export const createDestination = filename => {
    const name = `${generate()}${extname(filename)}`;
    return { name, path: `${path}${sep}${name}` };
};

/**
 * @method removeFile
 * @param {String} filename
 * @return {void}
 */
export const removeFile = filename => {
    unlink(`${path}${sep}${filename}`, identity);
};
