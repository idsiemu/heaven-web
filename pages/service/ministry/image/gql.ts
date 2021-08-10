import { DocumentNode, gql } from '@apollo/client';

export const GET_IMAGES: DocumentNode = gql`
    query getImages($idx: Int!) {
        getImages(idx: $idx) {
            status
            data {
                idx
                domain
                origin
                m_size
                order_by
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


export const SET_IMAGES: DocumentNode = gql`
    mutation setImages($idx: Int!, $images: [Upload!]!) {
        setImages(idx: $idx, images: $images) {
            status
            data {
                idx
                domain
                origin
                m_size
                order_by
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