import { DocumentNode, gql } from '@apollo/client';

export const GET_LOCATIONS: DocumentNode = gql`
    query getLocations($idx: Int!) {
        getLocations(idx: $idx) {
            status
            data {
                idx
                location
                details {
                    idx
                    location
                    state
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

export const SET_LOCATIONS: DocumentNode = gql`
    mutation setLocations($idx: Int!, $locations: [InputLocation]) {
        setLocations(idx: $idx, locations: $locations) {
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