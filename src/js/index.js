import React, { PureComponent } from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import * as Home from './containers/home/index';
import * as About from './containers/about/index';

/**
 * @class Index
 * @extends {PureComponent}
 */
export default class Index extends PureComponent {

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {

        return (
            <section className="carpetbase">
                <header>CarpetBase</header>
                <nav>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about.html">About</NavLink>
                </nav>
                <main>
                    <Switch>
                        <Route path="/" exact render={() => <Home.Index />} />
                        <Route path="/about.html" render={() => <About.Index />} />
                    </Switch>
                </main>
                <footer />
            </section>
        );

    }

}
