import styled, { css } from "styled-components";
import Button from '@material-ui/core/Button';

export const BaseButton = styled.button`
  font-size: 1.25rem;
  line-height: 1.5rem;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.dodgerBlue};
  border-radius: 0.3rem;
  border: none;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
`;

interface IButton {
  width?: string;
  bgcolor?: string
}

export const HButton = styled(Button)<IButton>`
    ${props => css`
        width: ${props.width};
        max-width: ${`${props.theme.size.mobileWidth}px`};
        height: 55px;
        color: ${props.theme.colors.white};
        background: ${props.bgcolor ? props.theme.colors[props.bgcolor] : props.theme.colors.blackGrey};
        &:hover {
            background: ${props.theme.colors.lightGrey};
        }
    `}
`;