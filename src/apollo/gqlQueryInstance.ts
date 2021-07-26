import { DocumentNode, useQuery } from "@apollo/client";
import { NameNode, OperationDefinitionNode } from "graphql";
import { Cookie } from "next-cookie";
import { TOKEN } from "src/assets/utils/ENV";


const gqlQueryInstance = async(query : DocumentNode, cookie: Cookie) => {
    const {loading, error, data, refetch} = useQuery(query)
    if(!loading){
        const innerQuery = query.definitions[0] as OperationDefinitionNode
        const { value } = innerQuery.name as NameNode
        if(data[value].status === 201){
            //쿠키 세션 바꾸고 리페치
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