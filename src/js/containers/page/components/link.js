import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * @class Link
 * @extends {PureComponent}
 */
export default class Link extends PureComponent {

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { model } = this.props;

        return (
            <li>
                Links...
            </li>
        );

    }

}
