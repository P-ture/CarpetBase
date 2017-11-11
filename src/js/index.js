import React, { PureComponent } from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import hash from 'object-hash';
import routes from './routes';

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
                        {routes.map(route => {
                            return <Route key={hash(route)} {...route} />
                        })};
                    </Switch>
                </main>
                <footer />
            </section>
        );

    }

}
