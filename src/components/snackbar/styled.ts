import { SnackbarOrigin, Snackbar } from "@material-ui/core";
import styled from 'styled-components';
export interface ISnack extends SnackbarOrigin {
    open: boolean;
    message: string | null
}

export const HSnack = styled(Snackbar)`
    && {
        width: 100%;
        .MuiSnackbarContent-root{
            max-width: ${({theme}) => `${theme.size.mobileWidth}px`};
            width: 100%;
        }
    }
`