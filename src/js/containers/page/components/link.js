import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * @class Link
 * @extends {PureComponent}
 */
export default class Link extends PureComponent {

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

        return (
            <li>
                Links...
            </li>
        );

    }

}
