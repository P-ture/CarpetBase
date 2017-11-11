import React, { PureComponent } from 'react';

/**
 * @class Index
 * @extends {PureComponent}
 */
export class Index extends PureComponent {

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
