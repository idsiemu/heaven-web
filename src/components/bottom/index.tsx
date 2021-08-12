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
        width: 100%;
        display: flex;
        justify-content: center;
        ${props.isBottom ? '' : 'position: fixed; padding: 0 1.25rem 1.25rem; bottom: 0;'}
        .inner-bottom {
            display: flex;
            width: 100%;
            justify-content: space-between;
            ${props.state && props.state === 'front' ? 'justify-content: flex-end;' : ''}
            max-width: ${`${props.theme.size.mobileWidth}px`};
        }
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
            <div className="inner-bottom">
                {props.children}
            </div>
        </BottomStyle>
    );
};

export default BottomComponent;
