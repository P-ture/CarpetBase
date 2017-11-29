import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createThumbnail } from '../helpers/thumbnail';

/**
 * @class Gallery
 * @extends {PureComponent}
 */
export default class Gallery extends PureComponent {

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        model: PropTypes.object.isRequired
    };

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { model } = this.props;

        return (
            <li>

            </li>
        );

    }

}
