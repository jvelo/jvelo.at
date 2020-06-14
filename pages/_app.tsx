import App from 'next/app';

import React from 'react';
import { Router } from 'next/router';
import PageLoading from '../components/PageLoading/PageLoading';

type Props = {
};

class SiteApp extends App<Props> {
    state = {
        hasNavigated: false,
        isRouteChanging: false,
        loadingKey: 'main',
    };

    routeChangeStartHandler() {
        this.setState({
            isRouteChanging: true,
        });
    }

    routeChangeEndHandler() {
        this.setState({
            isRouteChanging: false,
        });
    }

    componentDidMount(): void {
        Router.events.on(
            'routeChangeStart',
            this.routeChangeStartHandler.bind(this)
        );
        Router.events.on(
            'routeChangeComplete',
            this.routeChangeEndHandler.bind(this)
        );
        Router.events.on('routeChangeError', this.routeChangeEndHandler.bind(this));
    }

    componentWillUnmount(): void {
        Router.events.off(
            'routeChangeStart',
            this.routeChangeStartHandler.bind(this)
        );
        Router.events.off(
            'routeChangeComplete',
            this.routeChangeEndHandler.bind(this)
        );
        Router.events.off(
            'routeChangeError',
            this.routeChangeEndHandler.bind(this)
        );
    }

    render() {
        const { Component, pageProps } = this.props;

        return (
            <>
                <PageLoading
                    isRouteChanging={this.state.isRouteChanging}
                    loadingKey={this.state.loadingKey}
                />
                <Component {...pageProps} />
            </>
        );
    }
}

SiteApp.getInitialProps = async ({ ctx, Component }) => {
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    return {
        pageProps,
    };
};

export default SiteApp;