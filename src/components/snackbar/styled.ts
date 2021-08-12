import { SnackbarOrigin, Snackbar } from "@material-ui/core";
import styled, { css } from 'styled-components';
export interface ISnack extends SnackbarOrigin {
    open: boolean;
    message: string | null
}

export const HSnack = styled(Snackbar)`
    ${({theme}) => css`
        .MuiSnackbarContent-root{
            width: ${`${theme.size.mobileWidth}px`};
        }
    `}
`