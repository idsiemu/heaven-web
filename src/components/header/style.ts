import styled from "styled-components";

export const Wrapper = styled.div`
    position: fixed;
    width: 100%;
    top: 0;
    text-align: center;
    border-bottom: 1px solid ${props => props.theme.colors.whiteGrey};
`;

export const Icon = styled.div`
    padding: 1.25rem;
`

export const Profile = styled.div`
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    padding: 1.25rem;
`