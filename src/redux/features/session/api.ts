import { DocumentNode, gql } from "@apollo/client";
import axiosApiInstance from "src/axios";
import { ILoginPayload, IRegisterPayload } from "./slice";
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
                    gender,
                    image {
                        domain,
                        file_serial,
                        origin,
                        xl_size,
                        l_size,
                        m_size,
                        s_size,
                        ss_size
                    }
                },
                token,
                errors {
                    code,
                    var,
                    text
                }
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
        mutation login($id:String!, $password:String!, $device:SessionType!) {
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
                location,
                heaven_token,
                refresh_token,
                errors {
                    code,
                    var,
                    text
                }
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

export const requestRegister = (param: IRegisterPayload) => {
    const query = `
        mutation register($id:String!, $password:String!, $phone: String, $name:String!, $role:Int, $device:SessionType!) {
            register(id:$id, password:$password, phone:$phone, name:$name, role:$role, device:$device) {
                status,
                session {
                    idx,
                    id,
                    name,
                    email,
                    phone,
                    gender
                },
                location,
                heaven_token,
                refresh_token,
                errors {
                    code,
                    var,
                    text
                }
            }
        }
    `

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