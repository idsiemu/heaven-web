import { DocumentNode } from "@apollo/client";
import { NameNode, OperationDefinitionNode } from "graphql";
import { TOKEN } from "src/assets/utils/ENV";
import { useCookie } from 'next-cookie';

const gqlQueryInstance = async(query : DocumentNode, method:any, param?: object) => {
    const {loading, data, refetch} = method(query, param)
    if(!loading){
        const innerQuery = query.definitions[0] as OperationDefinitionNode
        const { value } = innerQuery.name as NameNode
        if(data[value].status === 201){
            const cookie = useCookie();
            cookie.set(TOKEN, data[value].token, { path: '/' })
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