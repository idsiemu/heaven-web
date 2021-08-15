import { DocumentNode, gql } from '@apollo/client';

export const GET_SITES: DocumentNode = gql`
    query getSites($idx: Int!) {
        getSites(idx: $idx) {
            status
            data {
                site_name
                url
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

export const SET_SITES: DocumentNode = gql`
    mutation setSites($idx: Int!, $sites: [InputSite]) {
        setSites(idx: $idx, sites: $sites) {
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