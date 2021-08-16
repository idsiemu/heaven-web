import { DocumentNode, gql } from '@apollo/client';

export const SET_TITLE: DocumentNode = gql`
    mutation setTitle($service: ServiceInput!) {
        setTitle(service: $service) {
            status
            token
            location
            errors {
                code
                var
                text
            }
        }
    }
`;