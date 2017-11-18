import React, { Component } from 'react';

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
 * @method withStauses
 * @param {Object} WrappedComponent
 * @return {Object}
 */
export default function withStatuses(WrappedComponent) {

    return class extends Component {

        /**
         * @constant displayName
         * @type {String}
         */
        static displayName = WrappedComponent.displayName || WrappedComponent.name;

        /**
         * @constant WrappedComponent
         * @type {Object}
         */
        static WrappedComponent = WrappedComponent;

        /**
         * @constant state
         * @type {Object}
         */
        state = {
            status: statusTypes.DISABLED
        };

        /**
         * @method componentDidMount
         * @return {void}
         */
        componentDidMount() {
            this.setState({ status: this.state.status ^ statusTypes.DISABLED });
        }

        /**
         * Re-render the component to inform the user that we're sending data, and then revert
         * the status after a response has been received with the `setSent` method.
         *
         * @method setSending
         * @return {void}
         */
        setSending() {
            this.setState({ status: ((this.state.status | statusTypes.SENDING) & ~statusTypes.SUCCESS) & ~statusTypes.ERROR });
        }

        /**
         * Update the status depending on whether the data sent was successful or not.
         *
         * @method setSent
         * @param {Boolean} isSuccess
         * @return {void}
         */
        setSent(isSuccess) {
            const status = isSuccess ? statusTypes.SUCCESS : statusTypes.ERROR;
            this.setState({ status: (this.state.status & ~statusTypes.SENDING) | status });
        }

        /**
         * @method render
         * @return {Object}
         */
        render() {

            const augmentedProps = {
                isDisabled: Boolean(this.state.status & statusTypes.DISABLED),
                isSending: Boolean(this.state.status & statusTypes.SENDING),
                isError: Boolean(this.state.status & statusTypes.ERROR),
                isSuccess: Boolean(this.state.status & statusTypes.SUCCESS),
                setSending: this.setSending.bind(this),
                setSent: this.setSent.bind(this)
            };

            return <WrappedComponent {...this.props} {...augmentedProps} />;

        }

    };

}
