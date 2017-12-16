import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @class Carousel
 * @extends {Component}
 */
export default class Carousel extends Component {

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        model: PropTypes.object.isRequired,
        link: PropTypes.shape({
            slug: PropTypes.string.isRequired
        })
    };

    /**
     * @constant defaultProps
     * @type {Object}
     */
    static defaultProps = {
        link: null
    };

    /**
     * @constant state
     * @type {Object}
     */
    state = {
        model: this.props.model,
        show: 0
    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { model, show } = this.state;
        const pictures = model.media;
        const prevIndex = show <= 0 ? (pictures.length - 1) : show - 1;
        const nextIndex = show >= (pictures.length - 1) ? 0 : show + 1;

        return (
            model && (
                <section className="carousel" style={{ background: `url(${model.media[show].url}) no-repeat 50%/cover` }}>
                    <div className="previous" onClick={() => this.setState({ show: prevIndex })} />
                    <div className="next" onClick={() => this.setState({ show: nextIndex })} />
                    <p className="text">
                        {this.props.link && <a href={`/${this.props.link.slug}.html`}>Goto Page</a>}
                        {model.media[show].description}
                    </p>
                </section>
        ));

    }

}
