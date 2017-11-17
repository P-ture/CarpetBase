import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import * as actions from '../../reducers/config/actions';
import * as config from '../../miscellaneous/config';

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object}
 */
export const mapStateToProps = state => {

    return {
        meta: state.config.meta
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
 * @class Meta
 * @extends {Component}
 */
export default connect(mapStateToProps, mapDispatchToProps)(class Meta extends Component {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Admin/Meta';

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        meta: PropTypes.object.isRequired
    };

    /**
     * @method fetchData
     * @param {Function} dispatch
     * @return {Promise}
     */
    static fetchData = ({ dispatch }) => {
        return dispatch(actions.fetchMeta());
    };

    /**
     * @constant assets
     * @type {Array}
     */
    static cssDocuments = ['/css/meta.css'];

    /**
     * @constant requiresAuth
     * @type {Boolean}
     */
    static requiresAuth = true;

    /**
     * @constant meta
     * @type {Object}
     */
    state = {
        meta: { ...this.props.meta }
    };

     /**
      * @method update
      * @param {String} key
      * @return {Function}
      */
    update(key) {

        return event => {
            this.setState({ meta: { ...this.state.meta, [key]: event.target.value } });
        };

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { meta } = this.state;

        return (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Administrator: Dashboard`}>
                <section className="meta">
                    <h1>Meta</h1>
                    <form>
                        <div className="slogan">
                            <label htmlFor="slogan">Slogan will appear in the header, just beneath the logo.</label>
                            <input type="text" name="slogan" value={meta.slogan} onChange={this.update('slogan')} />
                        </div>
                        <div className="lat-long">
                            <label htmlFor="lat-long">Latitude and longitude values for the map on the contact form..</label>
                            <input type="number" name="latitude" value={meta.latitude} onChange={this.update('latitude')} />
                            <input type="number" name="longitude" value={meta.longitude} onChange={this.update('longitude')} />
                        </div>
                        <div className="social">
                            <label htmlFor="social"><a href="https://guides.github.com/features/mastering-markdown/">Markdown</a> for enumerating the social media links.</label>
                            <textarea name="social" value={meta.social} onChange={this.update('social')} />
                        </div>
                        <button type="submit">Save</button>
                    </form>
                </section>
            </DocumentTitle>
        );

    }

});
