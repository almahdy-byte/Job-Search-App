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

export const checkHR = (HRs = [] , HR)=>{
    HRs = HRs.map(HR=>HR.toString());
    HR=HR.toString();
    return HRs.find(HR_ID=> HR_ID === HR) ? true : false
}