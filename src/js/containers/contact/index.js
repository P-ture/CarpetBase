import React, { Component, PureComponent } from 'react';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import { values, all } from 'ramda';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';
import NotFound from '../error/not-found';
import * as config from '../../miscellaneous/config';
import * as actions from '../../reducers/config/actions';

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
 * @constant statusTypes
 * @type {Object}
 */
const statusTypes = {
    DISABLED: 1,
    SENDING: 2,
    ERROR: 4,
    SUCCESS: 8
};

/**
 * @class Marker
 * @extends {PureComponent}
 */
class Marker extends PureComponent {

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        text: PropTypes.string.isRequired
    };

    render() {

        return (
            <div className="marker">
                {this.props.text}
            </div>
        );

    }

}
const AnyReactComponent = ({ text }) => <div>{text}</div>;

/**
 * @class Connect
 * @extends {PureComponent}
 */
export default connect(mapStateToProps)(class Contact extends Component {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Contact/Index';

    /**
     * @constant cssDocuments
     * @type {Array}
     */
    static cssDocuments = ['/css/contact.css'];

    /**
     * @method fetchData
     * @param {Function} dispatch
     * @return {Promise}
     */
    static fetchData = ({ dispatch }) => {
        return dispatch(actions.fetchMeta());
    };

    /**
     * @constant state
     * @type {Object}
     */
    state = {
        status: statusTypes.DISABLED,
        form: {
            firstName: '',
            lastName: '',
            email: '',
            message: ''
        }
    };

    /**
     * @method componentDidMount
     * @return {void}
     */
    componentDidMount() {
        this.setState({ status: this.state.status ^ statusTypes.DISABLED });
    }

    /**
     * @method submit
     * @param {Object} event
     * @return {Promise}
     */
    async submit(event) {

        event.preventDefault();

        // Re-render the component to inform the user that we're sending the e-mail, and then revert
        // the status after a response has been received.
        this.setState({ status: ((this.state.status | statusTypes.SENDING) & ~statusTypes.SUCCESS) & ~statusTypes.ERROR });
        const { data } = await this.props.instance.post('/mail.json', this.state.form);

        // Determine what the response was so we can update the UI accordingly.
        const status = data.sent ? statusTypes.SUCCESS : statusTypes.ERROR;
        this.setState({ status: this.state.status & ~statusTypes.SENDING | status });

    }

    /**
     * @method update
     * @param {String} field
     * @return {Function}
     */
    update(field) {

        return event => {
            this.setState({ form: { ...this.state.form, [field]: event.target.value } });
        };

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { form, status } = this.state;
        const isSubmittable = all(value => value.length > 0)(values(form));
        const [lat, lng] = [Number(this.props.meta.latitude), Number(this.props.meta.longitude)];
        const isDisabled = Boolean(status & statusTypes.DISABLED);
        const isSending = Boolean(status & statusTypes.SENDING);
        const isError = Boolean(status & statusTypes.ERROR);
        const isSuccess = Boolean(status & statusTypes.SUCCESS);

        return (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Contact`}>
                <section className="contact">
                    <section className="map" style={{ width: '500px', height: '500px' }}>
                        <GoogleMap center={{ lat, lng }} defaultZoom={14}>
                            <Marker lat={lat} lng={lng} text="CarpetBase" />
                        </GoogleMap>
                    </section>
                    <h1>Contact</h1>
                    <form onSubmit={this.submit.bind(this)}>

                        {isSuccess && (
                            <section className="error">Thank you! Your message has been successfully sent.</section>
                        )}

                        {isError && (
                            <section className="error">Unable to send the e-mail at this moment in time.</section>
                        )}

                        <div className="first-name">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                disabled={isDisabled}
                                onChange={this.update('firstName')}
                                />
                        </div>

                        <div className="last-name">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                disabled={isDisabled}
                                onChange={this.update('lastName')}
                                />
                        </div>

                        <div className="email">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                disabled={isDisabled}
                                onChange={this.update('email')}
                                />
                        </div>

                        <div className="message">
                            <label htmlFor="message">Message</label>
                            <textarea
                                name="message"
                                value={form.message}
                                disabled={isDisabled}
                                onChange={this.update('message')}
                                />
                        </div>

                        <button type="submit" disabled={isSending || isDisabled || !isSubmittable}>
                            {isSending ? 'Sending...' : 'Send'}
                        </button>

                    </form>
                </section>
            </DocumentTitle>
        );

    }

});
