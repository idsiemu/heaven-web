import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

interface IInput {
    width?: string;
    state?: string
}

export const HInput = styled(TextField)<IInput>`
    && {
        position: relative;
        width: ${props => (props.width ? props.width : 'auto')};
        max-width: ${({theme}) => `${theme.size.mobileWidth}px`};
        margin-bottom: 2rem;
        .MuiFormLabel-root.Mui-focused{
            color: ${({ theme }) => theme.colors.black};

        }
        .MuiOutlinedInput-notchedOutline {
            border-color: ${props => {
                switch (props.state) {
                    case 'IDLE':
                        return props.theme.colors.lightGrey
                    case 'ERROR':
                        return props.theme.colors.red
                    case 'SUCCESS':
                        return props.theme.colors.green
                    default:
                        return props.theme.colors.lightGrey
                }
            }};
        }
        .Mui-focused {
            fieldset {
                border-color: ${({ theme }) => theme.colors.lightGrey};
            }
        }
        .MuiFormHelperText-contained {
            position: absolute;
            bottom: -1.5rem;
            color: ${({ theme }) => theme.colors.red};
        }
    }
`;