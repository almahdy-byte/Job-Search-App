import { GraphQLBoolean, GraphQLEnumType, GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { Gender, Roles } from "../../../utils/globalEnums/enums.js";

const  picture = new GraphQLObjectType({
    name:"picture",
    fields:{
        secure_url:{
            type:GraphQLString
        } , 
        public_id:{
            type:GraphQLID
        }
    }
})
export const userType = new GraphQLObjectType({
    name:'userType',
    fields:{
        firstName:{
            type:GraphQLString
        },
        role:{
            type:new GraphQLEnumType({
                name:'role',
                values:{
                    USER : {value : Roles.USER},
                    ADMIN : {value : Roles.ADMIN}
                }
            })
        } ,
        gender:{
            type:new GraphQLEnumType({
                name:'gender',
                values:{
                    MALE :{value :  Gender.MALE},
                    FEMALE :{value : Gender.FEMALE}
                }
            })
        },
        email:{
            type:GraphQLString
        },
        phone:{
            type:GraphQLString
        },
        deletedBy:{
            type:GraphQLString
        },
        id:{
            type:GraphQLID
        },
        DOB:{
            type:GraphQLString
        },
        isConfirmed:{
            type:GraphQLBoolean
        },
        isDeleted:{
            type:GraphQLBoolean
        },
        profilePic:{
            type: picture
        },
        coverPic:{
            type : picture
        }
    }
})

