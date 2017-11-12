import React, { PureComponent } from 'react';

/**
 * @class NotFound
 * @extends {PureComponent}
 */
export default class NotFound extends PureComponent {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Error/NotFound';

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return (
            <section className="error-not-found">
                <h1>404 &mdash; Not Found</h1>
            </section>
        );

    }

}
