import { DocumentNode, gql } from '@apollo/client';

export const GET_AGES: DocumentNode = gql`
    query getAge($idx: Int!) {
        getAge(idx: $idx) {
            status
            data {
                idx
                age
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

export const SET_AGES: DocumentNode = gql`
    mutation setAge($idx: Int!, $ages: [Int!]) {
        setAge(idx: $idx, ages: $ages) {
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