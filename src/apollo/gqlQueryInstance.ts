import { DocumentNode, useQuery } from "@apollo/client";
import { NameNode, OperationDefinitionNode } from "graphql";
import { Cookie } from "next-cookie";
import { TOKEN } from "src/assets/utils/ENV";


const gqlQueryInstance = async(query : DocumentNode, cookie: Cookie, param?: object) => {
    const {loading, error, data, refetch} = useQuery(query, param)
    console.log(data)
    if(!loading){
        const innerQuery = query.definitions[0] as OperationDefinitionNode
        const { value } = innerQuery.name as NameNode
        console.log(data[value].status)
        if(data[value].status === 201){
            //쿠키 세션 바꾸고 리페치
            console.log(data)
            cookie.set(TOKEN, data[value].token)
            const refetched = await refetch()
            return refetched
        }else{
            return {
                loading,
                data
            }
        }
    }else{
        return {
            loading
        } 
    }
}

export default gqlQueryInstance