export const pagination = (page , size)=>{
    page = page <= 0 ?  1 : page ;
    const limit = size <= 0 ?  1 : size ;
    const skip = size * (page - 1);
    return { skip , limit};
}