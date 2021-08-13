import styled, { css } from "styled-components";
import Container from '@material-ui/core/Container';

export const Body = styled(Container)`
    ${() => css`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 78px;
        width: 100%;
        height: 100vh;
    `}
`;