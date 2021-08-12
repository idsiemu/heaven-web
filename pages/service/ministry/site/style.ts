import styled, { css } from "styled-components";
import Container from '@material-ui/core/Container';

export const SiteContainer = styled(Container)`
    ${() => css`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.25rem;
    `}
`;