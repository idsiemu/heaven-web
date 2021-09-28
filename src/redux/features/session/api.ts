import { DocumentNode, gql } from "@apollo/client";
import axiosApiInstance from "src/axios";
import { IKakaoPayload, IRegisterPayload } from "./slice";
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
                    },
                    role {
                        role_idx
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



export const requestKakaoLogin = ( param:IKakaoPayload ) => {
    const query = `
        mutation kakaoLogin($access_token:String!, $refresh_token:String!, $device: SessionType!) {
            kakaoLogin(access_token:$access_token, refresh_token:$refresh_token, device:$device) {
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
                    },
                    role {
                        role_idx
                    }
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
        mutation register($id:String!, $password:String!, $phone: String, $name:String!, $group_name: String, $role:Int, $device:SessionType!) {
            register(id:$id, password:$password, phone:$phone, name:$name, group_name:$group_name, role:$role, device:$device) {
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
                    },
                    role {
                        role_idx
                    }
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