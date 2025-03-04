import { GraphQLList } from "graphql";
import { userType } from "./admin.graphql.types.js";
import * as adminGraphQlServices from './admin.graphql.controller.js'

export const adminQuery = {
    getAllUsers : {
        type:new GraphQLList(userType),
        resolve:adminGraphQlServices.getAllUsers
    }
} 