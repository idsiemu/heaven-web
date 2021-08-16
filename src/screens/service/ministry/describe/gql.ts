import { DocumentNode, gql } from '@apollo/client';

export const GET_DESCRIBE: DocumentNode = gql`
    query getDescribe($idx: Int!) {
        getDescribe(idx: $idx) {
            status
            data
            token
            errors {
                code
                var
                text
            }
        }
    }
`;

export const SET_DESCRIBE: DocumentNode = gql`
    mutation setDescribe($idx: Int!, $describe: String!) {
        setDescribe(idx: $idx, describe: $describe) {
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