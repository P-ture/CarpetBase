import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { compose } from 'ramda';
import { generate } from 'shortid';
import * as actions from '../../reducers/gallery/actions';
import * as config from '../../miscellaneous/config';
import withStatuses from '../../behaviours/status';

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object}
 */
export const mapStateToProps = state => {

    return {
        gallery: state.gallery.content
    };

};

/**
 * @method mapDispatchToProps
 * @param {Function} dispatch
 * @return {Object}
 */
const mapDispatchToProps = dispatch => {
    return bindActionCreators(actions, dispatch);
};

/**
 * @method fetch
 * @param {Function} dispatch
 * @param {Object} params
 * @return {Promise}
 */
export const fetch = ({ dispatch, params }) => {
    return dispatch(actions.fetchGallery(params.slug));
};

/**
 * @method enhance
 * @return {Object}
 */
const enhance = compose(withStatuses, connect(mapStateToProps, mapDispatchToProps));

/**
 * @class Meta
 * @extends {Component}
 */
export default enhance(class Galleries extends Component {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Admin/Gallery';

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { gallery } = this.props;

        return (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Administrator: Galleries`}>
                <section className="galleries">
                    <h1>Galleries</h1>
                    <form>
                        <div className="name">
                            <label htmlFor="name">Name:</label>
                            <input type="text" name="name" value={gallery.name} />
                        </div>
                    </form>
                </section>
            </DocumentTitle>
        );

    }

});
