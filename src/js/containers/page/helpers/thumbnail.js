/**
 * @method createThumbnail
 * @param {String} path
 * @param {Number} size
 * @return {void}
 */
export function createThumbnail(path, size) {
    return path.replace(/^((.*)[\\/]upload)(.*)/, `$1/w_${size},c_scale$3`);
}
