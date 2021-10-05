import React from 'react';
import App from 'next/app';
import { StyledThemeProvider } from '@definitions/styled-components';
import { Provider } from 'react-redux';
import store from '@redux/store';
import { ApolloProvider } from '@apollo/client';
import client from 'src/apollo';
import { IHistory } from '@interfaces';
class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return { pageProps };
    }

    state = {
        history: [] // keep history items in state
    };

    componentDidMount() {
        const { asPath } = this.props.router;
        this.setState((prevState: IHistory) => ({ history: [...prevState.history, asPath] }));
    }

    componentDidUpdate() {
        const { history } = this.state;
        const { asPath, ...rest } = this.props.router;
        // console.log('path : ' + asPath);
        // console.log('his : ' + history[history.length - 1]);
        // if (history[history.length - 2]) {
        //     console.log('-1 : ' + history[history.length - 2]);
        // }
        if (history[history.length - 1] !== asPath) {
            if (history[history.length - 2]) {
                if (history[history.length - 2] === asPath) {
                    this.setState(() => ({ history: history.slice(0, -1) }));
                } else {
                    if (rest.query.replace) {
                        const setHistory = history.length < 2 ? [asPath] : [...history.splice(-1), asPath];
                        this.setState(() => ({ history: setHistory }));
                    } else {
                        this.setState((prevState: IHistory) => ({ history: [...prevState.history, asPath] }));
                    }
                }
            } else {
                if (rest.query.replace) {
                    const setHistory = history.length < 2 ? [asPath] : [...history.splice(-1), asPath];
                    this.setState(() => ({ history: setHistory }));
                } else {
                    this.setState((prevState: IHistory) => ({ history: [...prevState.history, asPath] }));
                }
            }
        }
        // else if (history[history.length - 2] === asPath) {
        //     console.log('back...');
        //     console.log(history.splice(-1));
        //     this.setState(() => ({ history: history.splice(-1) }));
        // }
    }

    render() {
        const { Component, pageProps } = this.props;
        return (
            <StyledThemeProvider>
                <Provider store={store}>
                    <ApolloProvider client={client}>
                        <Component history={this.state.history} {...pageProps} />
                    </ApolloProvider>
                </Provider>
            </StyledThemeProvider>
        );
    }
}

export default MyApp;
