import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @class Galleries
 * @extends {PureComponent}
 */
export default class Galleries extends Component {

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        model: PropTypes.object.isRequired,
        type: PropTypes.string.isRequired,
        onMedia: PropTypes.func
    };

    /**
     * @constant modalTypes
     * @type {Object}
     */
    static defaultProps = {
        onMedia: () => []
    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { model, onMedia, type } = this.props;

        const images = model.media;
        const name = model.name;
        return (
            <li className={`${type}`}>
                <section className="content" onClick={ () => onMedia(images, name) }>
                    <div style={{ background: `url(${model.media[0].url}) 50% no-repeat /cover` }} />
                    <h4>{model.name}</h4>
                </section>
            </li>
        );

    }

}
