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
                if (!(Router.pathname === '/login')) {
                    Router.replace('/login?replace=true', '/login');
                }
            } else {
                if (Router.pathname === '/login') {
                    let alias = '';
                    let setLocation = '';
                    if (session.location) {
                        if (session.location.indexOf('?') === -1) {
                            alias = session.location;
                            setLocation = `${session.location}?replace=true`;
                        } else {
                            alias = session.location.split('?')[0];
                            setLocation = `${session.location}&replace=true`;
                        }
                    } else {
                        alias = '/';
                        setLocation = '/';
                    }
                    Router.replace(setLocation, alias);
                } else {
                    if (session.location) {
                        let alias = '';
                        let setLocation = '';
                        if (session.location.indexOf('?') === -1) {
                            alias = session.location;
                            setLocation = `${session.location}?replace=true`;
                        } else {
                            alias = session.location.split('?')[0];
                            setLocation = `${session.location}&replace=true`;
                        }
                        Router.replace(setLocation, alias);
                        if (Router.pathname === alias) {
                            dispatch(sessionAction.setLocation(null));
                        }
                    }
                }
            }
        }
        return () => {
            if (Router.pathname === session.location) {
                dispatch(sessionAction.setLocation(null));
            }
        };
    }, [session.initial, session.session]);
    // console.log('session : ' + session.session);
    // console.log('location : ' + session.location);
    // console.log('initial : ' + session.initial);
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
                        <React.Fragment>{Router.pathname === '/login' || session.location ? <Progress /> : props.children}</React.Fragment>
                    ) : (
                        <React.Fragment>{Router.pathname === '/login' ? props.children : <Progress />}</React.Fragment>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default AbstractComponent;
