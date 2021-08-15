import { DocumentNode, gql } from '@apollo/client';

export const GET_PROFILE: DocumentNode = gql`
    query getProfile {
        getProfile {
            status
            data {
                id
                name
                phone
                services {
                    role
                    init
                    name
                    location
                }
                image {
                    domain 
                    file_serial
                    origin 
                    xl_size
                    l_size
                    m_size 
                    s_size
                    ss_size
                }
            }
            token
            errors {
                code
                var
                text
            }
        }
    }
`;

export const SET_AVATAR: DocumentNode = gql`
    mutation setAvatar($avatar: Upload!) {
        setAvatar(avatar: $avatar) {
            status
            data {
                image {
                    domain 
                    file_serial
                    origin 
                    xl_size
                    l_size
                    m_size 
                    s_size
                    ss_size
                }
            }
            token
            errors {
                code
                var
                text
            }
        }
    }
`;

export const EDIT_PROFILE: DocumentNode = gql`
    mutation editProfile($name: String!, $phone: String!) {
        editProfile(name: $name, phone: $phone) {
            status
            token
            errors {
                code
                var
                text
            }
        }
    }
`;