import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createThumbnail } from '../helpers/thumbnail';

/**
 * @class Link
 * @extends {PureComponent}
 */
export default class Link extends PureComponent {

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
                        <header>{model.name}</header>
                        {model.description && <p>{model.description}</p>}
                        {model.slug && <a href={`/${model.slug}.html`}>Explore</a>}
                    </figcaption>

                </figure>

            </li>
        );

    }

}
