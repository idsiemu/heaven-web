import { DocumentNode, gql } from '@apollo/client';

export const GET_PROFILE: DocumentNode = gql`
    query getProfile {
        getProfile {
            status
            data {
                id
                name
                phone
                avatar
                services {
                    role
                    init
                    name
                    location
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
    mutation editProfile($idx: Int!, $describe: String!) {
        editProfile(idx: $idx, describe: $describe) {
            status
            location
            token
            errors {
                code
                var
                text
            }
        }
    }
`;