import styled from "styled-components";
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
}

export const HButton = styled(Button)<IButton>`
  width: ${props => props.width};
  max-width: ${({theme}) => `${theme.size.mobileWidth/2}px`};
  height: 55px;
  && {
      color: ${({ theme }) => theme.colors.white};
      background: ${({ theme }) => theme.colors.blackGrey};
      &:hover {
          background: ${({ theme }) => theme.colors.lightGrey};
      }
  }
`;