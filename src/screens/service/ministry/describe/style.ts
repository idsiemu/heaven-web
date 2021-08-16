import styled, { css } from "styled-components";
import Container from '@material-ui/core/Container';

export const DescribeContainer = styled(Container)`
    ${() => css`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 98px 1.25rem 1.25rem;
    `}
`;

export const DescribeArea = styled.textarea`
    padding: 0.725rem 1.5rem;
    border: 1px solid #E9EDF5;
    width: 100%;
    font-size: 1rem;
    font-weight: 400;
    box-sizing: border-box;
    border-radius: 6px;
    line-height: inherit;
    min-height: calc(100vh - 475px);
    max-width: ${props => (`${props.theme.size.mobileWidth}px`)};
    height: 300px;
`

export const DescribeH2 = styled.h2`
    font-weight: 400;
    -webkit-letter-spacing: -0.03em;
    -moz-letter-spacing: -0.03em;
    -ms-letter-spacing: -0.03em;
    letter-spacing: -0.03em;
    line-height: 1.5;
    font-size: 0.9375rem;
    color: #202A3E;
    line-height: 1.467;
    color: #121A29;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1.34;
    margin: 0.75rem 0 1.5rem;
    padding: 0 2px;
`