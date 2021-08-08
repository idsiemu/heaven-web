import { FC, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

interface IStyle {
    isBottom: boolean;
}

interface IBottomComponent {
    init: boolean;
}

const BottomStyle = styled.div<IStyle>`
    ${props => css`
        display: flex;
        width: 100%;
        justify-content: ${props.isBottom ? 'space-between' : 'space-between'};
        ${props.isBottom ? '' : 'position: fixed; padding: 2rem; bottom: 0;'};
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
        if (window.innerHeight + window.scrollY + 200 > document.body.offsetHeight && window.scrollY) {
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
    return <BottomStyle isBottom={isBottom}>{props.children}</BottomStyle>;
};

export default BottomComponent;
