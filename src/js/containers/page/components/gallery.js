import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';

/**
 * @class Gallery
 * @extends {PureComponent}
 */
export default class Gallery extends Component {

     /**
     * @constant state
     * @type {Object}
     */
    state = {
        photoIndex: 0,
        isOpen: false
    }

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        model: PropTypes.object.isRequired,
        type: PropTypes.string.isRequired
    };

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { model } = this.props;
        const { isOpen, photoIndex } = this.state;
        const images = model.media;

        return (
            <li className={`${this.props.type}`}>
                <section className="content" onClick={() => this.setState({ isOpen: true })}>
                    <div style={{ background: `url(/media/${model.media[0].filename}) 50% no-repeat /cover` }} />
                    <h4>{model.name}</h4>
                </section>

                {isOpen &&
                    <Lightbox
                        mainSrc={`/media/${images[photoIndex].filename}`}
                        nextSrc={`/media/${images[(photoIndex + 1) % images.length].filename}`}
                        prevSrc={`/media/${images[(photoIndex + images.length - 1) % images.length].filename}`}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() => this.setState({ photoIndex: (photoIndex + images.length - 1) % images.length })}
                        onMoveNextRequest={() => this.setState({ photoIndex: (photoIndex + 1) % images.length })}
                        />
                }

            </li>
        );

    }

}
