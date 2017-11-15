import React, { PureComponent } from 'react';
import DocumentTitle from 'react-document-title';
import * as config from '../../miscellaneous/config';

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
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Not Found`}>
                <section className="error-not-found">
                    <h1>404 &mdash; Not Found</h1>
                </section>
            </DocumentTitle>
        );

    }

}
