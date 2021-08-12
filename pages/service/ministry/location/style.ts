import styled, { css } from "styled-components";
import Container from '@material-ui/core/Container';
import { FormControlLabel, FormGroup } from "@material-ui/core";

export const LocationContainer = styled(Container)`
    ${() => css`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.25rem;
    `}
`;

export const HFormGroup = styled(FormGroup)`
    ${({theme}) => css`
        width: 100%;
        max-width: ${`${theme.size.mobileWidth}px`};
    `}
`

export const HFormControlLabel = styled(FormControlLabel)`
    ${props => css`
        border-radius: 0.75rem;
        margin: 0 0 0.5rem -5px;
        -webkit-transition: background-color 150ms cubic-bezier(0.4,0,0.2,1) 0ms;
        transition: background-color 150ms cubic-bezier(0.4,0,0.2,1) 0ms;
        background-color : ${props['data-checked'] ? props.theme.colors.whiteGrey : '' };
        .MuiCheckbox-root {
            padding: 0.8rem;
        }
        .Mui-checked {
            color: ${props.theme.colors.lightGrey};
        }
    `}
`