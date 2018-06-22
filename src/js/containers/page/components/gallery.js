import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @class Carousel
 * @extends {Component}
 */
export default class Gallery extends Component {

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        model: PropTypes.array.isRequired
    };

    componentWillReceiveProps(nextProps) {
        return nextProps !== this.props && this.setState({ model: nextProps.model, index: 0 });
    }

    /**
     * @constant state
     * @type {Object}
     */
    state = {
        model: this.props.model,
        index: 0
    }

    /**
     * @method render
     * @return {Object}
     */
    render() {
        const { model, index } = this.state;
        const prevIndex = index <= 0 ? (model.length - 1) : index - 1;
        const nextIndex = index >= (model.length - 1) ? 0 : index + 1;

        return (
            model && (
                <section className="carousel" style={{ background: `url(${model[index].url}) no-repeat 50%/cover` }}>
                    <div className="previous" onClick={() => this.setState({ index: prevIndex })} />
                    <div className="next" onClick={() => this.setState({ index: nextIndex })} />
                </section>
        ));

    }

}
