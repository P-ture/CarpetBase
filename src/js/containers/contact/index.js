import React, { Component } from 'react';
import { values, all } from 'ramda';
import DocumentTitle from 'react-document-title';

/**
 * @class Contact
 * @extends {Component}
 */
export default class Contact extends Component {

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
     * @constant state
     * @type {Object}
     */
    state = {
        isDisabled: true,
        error: null,
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
        this.setState({ isDisabled: false });
    }

    /**
     * @method submit
     * @param {Object} event
     * @return {Promise}
     */
    async submit(event) {
        event.preventDefault();
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

        const { isDisabled, form } = this.state;
        const isSubmittable = all(value => value.length > 0)(values(form));

        return (
            <DocumentTitle title="Contact">
                <section className="contact">
                    <h1>Contact</h1>
                    <form onSubmit={this.submit.bind(this)}>
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
                        <button type="submit" disabled={isDisabled || !isSubmittable}>Submit</button>
                    </form>
                </section>
            </DocumentTitle>
        );

    }

}
