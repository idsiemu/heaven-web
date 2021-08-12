import { FC, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

type state = 'front' | 'end';
interface IStyle {
    isBottom: boolean;
    state?: state;
}
interface IBottomComponent {
    state?: state;
}

const BottomStyle = styled.div<IStyle>`
    ${props => css`
        display: flex;
        width: 100%;
        max-width: 420px;
        justify-content: ${props.isBottom ? 'space-between' : 'space-between'};
        ${props.isBottom ? '' : 'position: fixed; padding: 0 1.25rem 1.25rem; bottom: 0;'};
        ${props.state && props.state === 'front' ? 'justify-content: flex-end;' : ''}
    `}
`;

const BottomComponent: FC<IBottomComponent> = props => {
    const [isBottom, setIsBottom] = useState<boolean>(false);

    // function throttle(fn, wait) {
    //     var time = Date.now();
    //     return function () {
    //         if (time + wait - Date.now() < 0) {
    //             fn();
    //             time = Date.now();
    //         }
    //     };
    // }
    // let timeout;
    const bottomEvent = () => {
        const currentHeight = window.innerHeight + window.scrollY + 85
        if (currentHeight >= document.body.offsetHeight && window.scrollY) {
            // clearTimeout(timeout);
            // timeout = setTimeout(() => {
            //     setIsBottom(true);
            // }, 300);
            setIsBottom(true);
        } else {
            // clearTimeout(timeout);
            // timeout = setTimeout(() => {
            //     setIsBottom(false);
            // }, 200);
            setIsBottom(false);
        }
    };
    useEffect(() => {
        document.addEventListener('scroll', bottomEvent);
        return () => {
            document.removeEventListener('scroll', bottomEvent);
        };
    }, []);
    return (
        <BottomStyle isBottom={isBottom} state={props.state}>
            {props.children}
        </BottomStyle>
    );
};

export default BottomComponent;
