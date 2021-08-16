import styled, { css } from "styled-components";
import Container from '@material-ui/core/Container';
import BottomNavigation from '@material-ui/core/BottomNavigation';

export const HomeContainer = styled(Container)`
    ${() => css`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.25rem;
    `}
`;

export const HBottomNavigation = styled(BottomNavigation)`
    ${({theme}) => css`
        width: 100%;
        bottom: 0;
        position: fixed;
        .Mui-selected {
            color : ${theme.colors.dodgerBlue}
        }
    `}
`