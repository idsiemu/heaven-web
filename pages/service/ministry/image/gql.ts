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

export const DELETE_IMAGE: DocumentNode = gql`
    mutation deleteImage($idx: Int!) {
        deleteImage(idx: $idx) {
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

export const CHANGE_IMAGES_ORDER: DocumentNode = gql`
    mutation changeImagesOrder($idx: Int!, $orders: [Orders!]!) {
        changeImagesOrder(idx: $idx, orders: $orders) {
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