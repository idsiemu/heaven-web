import { DocumentNode, gql } from '@apollo/client';

export const SET_BRIEF: DocumentNode = gql`
    mutation setBrief($service: ServiceInput!) {
        setBrief(service: $service) {
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