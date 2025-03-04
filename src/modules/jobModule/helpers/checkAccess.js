export const checkAccess = (user , company , ownerOnly = false)=>{
    if(user._id.toString() === company.createdBy.toString())
        return true
    if(ownerOnly) 
        return false
    let companyHRs = company.HRs.map(e=>e.toString());
    if(companyHRs.find(hr => hr === user._id.toString()))
        return true 
    return false
}