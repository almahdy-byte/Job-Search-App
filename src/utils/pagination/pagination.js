export const pagination = (page , limit)=>{
    page = page <= 0 ?  1 : page ;
    size = size <= 0 ?  1 : size ;
    const skip = size * (page - 1);
    return { skip , limit};
}