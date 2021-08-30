import { sessionAction } from '@redux/actions';
import React, { ReactNode, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@redux/reducers';
import Router from 'next/router';
import Head from 'next/head';
import Progress from '@components/progress';

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

    useEffect(() => {
        if (session.location) {
            Router.push(`service/${session.location}`);
        }
        return () => {
            dispatch(sessionAction.setLocation(null));
        };
    }, [session.location]);

    return (
        <React.Fragment>
            <Head>
                <title>{headTitle}</title>
            </Head>
            {session.initial ? (
                <Progress />
            ) : (
                <React.Fragment>
                    {session.session ? (
                        <React.Fragment>{Router.pathname === '/login' || Router.pathname === '/register' ? <Progress /> : props.children}</React.Fragment>
                    ) : (
                        <React.Fragment>{Router.pathname === '/login' || Router.pathname === '/register' ? props.children : <Progress />}</React.Fragment>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default AbstractComponent;
