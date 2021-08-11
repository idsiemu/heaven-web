import styled, { css } from 'styled-components';
import Container from '@material-ui/core/Container';

export const ImageItem = styled.div`
list-style-type: none;
float: left;
width: 50%;
div {
    position: relative;
    span {
        position: absolute;
        top: 12px;
        left: 12px;
        background: #000;
        color: #fff;
        padding: 6px;
        border-radius: 100%;
        font-weight: 400;
        font-size: 14px;
    }
    div {
        position: absolute;
        bottom: 12px;
        right: 12px;
        button {
            font-size: 13px;
            padding: 4px 6px;
            font-weight: 500;
            cursor: pointer;
            background: #fff;
            color: ${({ theme }) => theme.colors.lightGrey};
            border: 1px solid ${({ theme }) => theme.colors.lightGrey};
        }
    }
}
`;

export const StyledImg = styled.img`
    display: block;
    width: 100%;
    height: 200px;
    border-radius: 8px;
    object-fit: cover;
    padding: 0.125rem;
    &:hover {
        cursor: grab;
    }
`;

export const ImageContainer = styled(Container)`
    ${() => css`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.25rem;
    `}
`;


export const ImageDropArea = styled.label`
    ${({ theme }) => css`
        width: 100%;
        background: #fff;
        border: 2px dashed rgba(160, 174, 192, 0.75);
        height: 200px;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        border-radius: 8px;
        margin-bottom: 16px;
        cursor: -webkit-grab;
        cursor: -moz-grab;
        cursor: grab;
    `}
`;

export const ImageList = styled.ul`
    ${({ theme }) => css`
        display: inline-block;
        background-color: #f8f9fc;
        white-space: nowrap;
        border-radius: 8px;
        width: 100%;
        padding: 0.125rem;
    `}
`;
