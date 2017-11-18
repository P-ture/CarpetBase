import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import * as actions from '../../reducers/config/actions';
import * as config from '../../miscellaneous/config';
import withStatuses from '../../behaviours/status';

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object}
 */
export const mapStateToProps = state => {

    return {
        instance: state.config.axiosInstance,
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
 * @method fetch
 * @param {Function} dispatch
 * @return {Promise}
 */
export const fetch = ({ dispatch }) => {
    return dispatch(actions.fetchMeta());
};

/**
 * @class Meta
 * @extends {Component}
 */
export default withStatuses(connect(mapStateToProps, mapDispatchToProps)(class Meta extends Component {

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
        setSending: PropTypes.func.isRequired,
        setSent: PropTypes.func.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        isSending: PropTypes.bool.isRequired,
        isError: PropTypes.bool.isRequired,
        isSuccess: PropTypes.bool.isRequired,
        meta: PropTypes.shape({
            latitude: PropTypes.string.isRequired,
            longitude: PropTypes.string.isRequired
        }).isRequired,
        instance: PropTypes.func.isRequired
    };

    /**
     * @constant meta
     * @type {Object}
     */
    state = {
        meta: { ...this.props.meta }
    };

    /**
     * @method submit
     * @param {Object} event
     * @return {Promise}
     */
    submit(event) {

        event.preventDefault();

        this.props.setSending(true);

        this.props.instance.post('/meta.json', this.state.meta).then(response => {
            this.props.setSent(response.data.saved);
        });

    }

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
        const { isDisabled, isSending, isError, isSuccess } = this.props;

        return (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Administrator: Meta`}>
                <section className="meta">
                    <h1>Meta</h1>
                    <form onSubmit={this.submit.bind(this)}>

                        {isSuccess && (
                            <section className="success">Meta data has been successfully saved.</section>
                        )}

                        {isError && (
                            <section className="error">There was a problem saving the meta data.</section>
                        )}

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

                        <button type="submit" disabled={isSending || isDisabled}>
                            {isSending ? 'Saving...' : 'Save'}
                        </button>

                    </form>
                </section>
            </DocumentTitle>
        );

    }

}));
