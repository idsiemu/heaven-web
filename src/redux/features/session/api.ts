import { DocumentNode, gql } from "@apollo/client";
import axiosApiInstance from "src/axios";
import { ILoginPayload } from "./slice";
import { GQL_DOMAIN } from "src/assets/utils/ENV";
import { NameNode, OperationDefinitionNode } from "graphql";


export const sessionInit = () => {
    const query = `
        query session {
            session {
                status,
                session {
                    idx,
                    id,
                    name,
                    email,
                    phone,
                    gender
                },
                token,
                text
            }
        }`;
    const SESSION: DocumentNode = gql`${query}`;
    const innerQuery = SESSION.definitions[0] as OperationDefinitionNode
    const { value } = innerQuery.name as NameNode
    
    return axiosApiInstance(value).post(
        `${GQL_DOMAIN}`,
        {
            query: `${query}`
        }
    )
}

export const requestLogin = ( param:ILoginPayload ) => {
    const query = `
        mutation login($id:String!, $password:String!, $device:String!) {
            login(id:$id, password:$password, device:$device) {
                status,
                session {
                    idx,
                    id,
                    name,
                    email,
                    phone,
                    gender
                },
                heaven_token,
                refresh_token,
                text
            }
        }`;
    const LOGIN: DocumentNode = gql`${query}`

    const innerQuery = LOGIN.definitions[0] as OperationDefinitionNode
    const { value } = innerQuery.name as NameNode

    return axiosApiInstance(value).post(
        `${GQL_DOMAIN}`,
        {
            query: `${query}`,
            variables: param,
        },
    )
}