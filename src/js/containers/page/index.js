import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { dissoc, isEmpty } from 'ramda';
import hash from 'object-hash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Markdown from 'react-markdown';
import DocumentTitle from 'react-document-title';
import * as pageActions from '../../reducers/page/actions';
import * as galleryActions from '../../reducers/gallery/actions';
import * as config from '../../miscellaneous/config';
import NotFound from '../error/not-found';
import Gallery from './components/gallery';
import Carousel from './components/carousel';
import Link from './components/link';
import { createThumbnail } from './helpers/thumbnail';

/**
 * @constant actions
 * @type {Object}
 */
const actions = { ...pageActions, ...galleryActions };

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object}
 */
export const mapStateToProps = state => {

    const { featuredGalleryId } = state.page.content;

    return {
        page: dissoc('galleries')(state.page.content),
        galleries: state.page.content ? state.page.content.galleries.map(model => {
            return { slug: model.slug, ...state.gallery.media[model.id] };
        }).filter(model => model.media.length > 0) : [],
        featuredGallery: featuredGalleryId ? state.gallery.media[featuredGalleryId] : null
    };

};

/**
 * @method mapDispatchToProps
 * @param {Function} dispatch
 * @return {Object}
 */
const mapDispatchToProps = dispatch => {
    return bindActionCreators(actions, dispatch);
};

/**
 * @method fetch
 * @param {Function} dispatch
 * @param {Object} instance
 * @param {Object} params
 * @return {Promise}
 */
export const fetch = async ({ dispatch, params }) => {

    const { result } = await dispatch(actions.fetchPage(params.page || actions.HOME));

    // Populate the store with all of the associated media for the current page.
    const galleries = result.galleries.map(async model => {
        return dispatch(actions.fetchMedia(model.galleryId));
    });

    // Fetch the featured gallery if we have one set.
    const featuredGallery = result.featuredGalleryId ? dispatch(actions.fetchMedia(result.featuredGalleryId)) : Promise.resolve();

    return Promise.all([...galleries, featuredGallery]);

};

/**
 * @class Page
 * @extends {PureComponent}
 */
export default connect(mapStateToProps, mapDispatchToProps)(class Page extends PureComponent {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Page/Index';

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        page: PropTypes.object.isRequired,
        galleries: PropTypes.array.isRequired,
        featuredGallery: PropTypes.object
    };

    /**
     * @constant defaultProps
     * @type {Object}
     */
    static defaultProps = {
        page: null,
        featuredGallery: null
    };

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { page, galleries, featuredGallery } = this.props;
        const isGallery = page.layoutId === 2;
        return isEmpty(page) ? <NotFound /> : (

            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} ${page.title}`}>
                <section className={`page ${page.slug}`}>

                    {page.hero && (
                        <section className="hero" style={{background: `url(${page.hero.url}) 50% no-repeat /cover`}}>
                        
                        </section>
                    )}

                    {featuredGallery && (
                        
                        <section className="featured-gallery">
                            <Carousel model={{...featuredGallery}}/>
                        </section>
                    )}

                    {page.title === 'Homepage' ? '' : <h1>{page.title}</h1> }
                    
                    <section className="information">
                        <Markdown source={page.content} />
                    </section>

                    {galleries.length > 0 && (
                        <section className="galleries">
                            <ul>
                                {galleries.map(model => {
                                    return isGallery ? <Gallery key={hash(model)} model={model} /> : <Link key={hash(model)} model={model} />;
                                })}
                            </ul>
                        </section>
                    )}

                </section>
            </DocumentTitle>

        );

    }

});
