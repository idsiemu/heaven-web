import { DocumentNode, gql } from '@apollo/client';

export const GET_LOCATIONS: DocumentNode = gql`
    query getLocations($idx: Int!) {
        getLocations(idx: $idx) {
            status
            data {
                idx
                location
                state
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