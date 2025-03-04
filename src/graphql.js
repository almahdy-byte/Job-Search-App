import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { adminQuery } from "./modules/adminModule/graphql/admin.graphql.js";

export const schema = new GraphQLSchema({
    query:new GraphQLObjectType({
        name:'Query',
        fields:{
            ...adminQuery
        }
    })
})