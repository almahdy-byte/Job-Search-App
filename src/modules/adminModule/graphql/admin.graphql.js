import { GraphQLList } from "graphql";
import { companyType, userType } from "./admin.graphql.types.js";
import * as adminGraphQlServices from './admin.graphql.controller.js'

export const adminQuery = {
    getAllUsers : {
        type:new GraphQLList(userType),
        resolve:adminGraphQlServices.getAllUsers
    } ,
    getAllCompanies:{
        type : new GraphQLList(companyType),
        resolve : adminGraphQlServices.getAllCompanies
    }
} 