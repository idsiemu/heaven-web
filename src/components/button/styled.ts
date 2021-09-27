import styled, { css } from "styled-components";
import Button from '@material-ui/core/Button';
import ReactKakaoLogin from 'react-kakao-login';

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

export const KaKaoBtn = styled(ReactKakaoLogin)`
  ${({ theme }) => css`
    width: 100% !important;
    height: 3rem !important;
    margin-bottom: 0.5rem !important;
    color: #3A1D1D !important;
    background-color: #F7E600 !important;
    border: 0 !important;
    border-radius: 0.625rem !important;
    font-size: 1.0625rem !important;
    font-weight: 500 !important;
    text-align: center;
    cursor: pointer;
    & > div:first-child {
      margin-right: 4px !important;
      vertical-align: middle;
    }
    &:hover {
      box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.1);
    }
  `};
`;