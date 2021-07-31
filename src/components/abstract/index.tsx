import { sessionAction } from '@redux/actions';
import React, { ReactNode, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@redux/reducers';
import Router from 'next/router';
import Head from 'next/head';

export interface IAbstractComponent {
    headTitle?: string;
    children: ReactNode;
}

const AbstractComponent = ({ headTitle, ...props }: IAbstractComponent) => {
    const session = useSelector((state: RootState) => state.sessionReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        if (session.initial) {
            dispatch(sessionAction.initialRequest());
        } else {
            if (!session.session) {
                if (!(Router.pathname === '/login' || Router.pathname === '/register')) {
                    Router.push('/login');
                }
            } else {
                if (Router.pathname === '/login' || Router.pathname === '/register') {
                    Router.push('/');
                }
            }
        }
    }, [session.initial, session.session]);
    return (
        <React.Fragment>
            <Head>
                <title>{headTitle}</title>
            </Head>
            {session.initial ? (
                <div>loading</div>
            ) : (
                <React.Fragment>
                    {session.session ? (
                        <React.Fragment>{Router.pathname === '/login' || Router.pathname === '/register' ? <div>loading</div> : props.children}</React.Fragment>
                    ) : (
                        <React.Fragment>{Router.pathname === '/login' || Router.pathname === '/register' ? props.children : <div>loading</div>}</React.Fragment>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default AbstractComponent;
