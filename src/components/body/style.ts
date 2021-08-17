import styled, { css } from "styled-components";
import Container from '@material-ui/core/Container';

export const Body = styled(Container)`
    ${() => css`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 98px 1.25rem 1.25rem;
        width: 100%;
    `}
`;