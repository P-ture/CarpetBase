import React from 'react';
import DocumentTitle from 'react-document-title';
import * as config from './miscellaneous/config';

/**
 * @method createError
 * @return {String}
 */
export default function createError() {

    return (
        <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Server Error`}>
            <section className="error">
                <h1>CarpetBase</h1>
                <p>We&apos;re currently experiencing difficulties. Please <a href="/">try again</a> later.</p>
            </section>
        </DocumentTitle>
    );

}
