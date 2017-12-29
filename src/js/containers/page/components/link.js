import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
        model: PropTypes.object.isRequired,
        type: PropTypes.string.isRequired
    };

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { model } = this.props;

        return (
            <li className={`${this.props.type}`}>
                <span style={model.slug && { background: `url(/media/${model.media[0].filename}) 50% no-repeat /cover` }}>
                    <figure>
                        <figcaption>
                            <header>{model.name}</header>
                            {model.description && <p>{model.description}</p>}
                            {model.slug && <a href={`/${model.slug}.html`}>Explore</a>}
                        </figcaption>
                    </figure>
                </span>
            </li>
        );

    }

}
