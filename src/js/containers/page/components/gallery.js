import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createThumbnail } from '../helpers/thumbnail';

/**
 * @class Gallery
 * @extends {PureComponent}
 */
export default class Gallery extends PureComponent {

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        model: PropTypes.object.isRequired
    };

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { model } = this.props;

        return (
            <li>

                <figure>

                    <picture>
                        <source
                            srcSet={`${createThumbnail(model.media[0].url, 200)},
                                    ${createThumbnail(model.media[0].url, 400)} 2x`}
                            />
                        <img src={createThumbnail(model.media[0].url, 200)} alt="Photograph" />
                    </picture>

                    <figcaption>
                        <header>{model.name} ({model.media.length} pictures in gallery)</header>
                        {model.description && <p>{model.description}</p>}
                    </figcaption>

                </figure>

            </li>
        );

    }

}
