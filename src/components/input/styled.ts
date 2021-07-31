import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

interface IInput {
    width?: string;
}

export const HInput = styled(TextField)<IInput>`
    && {
        width: ${props => (props.width ? props.width : 'auto')};
        max-width: 420px;
        margin-bottom: 2rem;
        & .Mui-focused {
            /* color: ${({ theme }) => theme.colors.black};
            fieldset {
                border-color: ${({ theme }) => theme.colors.lightGrey};
            } */
        }
    }
`;