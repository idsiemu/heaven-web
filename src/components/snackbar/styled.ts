import { SnackbarOrigin } from "@material-ui/core";

export interface SnackState extends SnackbarOrigin {
    open: boolean;
    message: string | null
}