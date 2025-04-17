import { StatusCodes } from "http-status-codes";
import { companyModel } from "../../DB/models/company.model.js";
import { userModel } from "../../DB/models/user.model.js";
import cloudinary from "../../utils/multer/cloudinary.js";
import { Roles } from "../../utils/globalEnums/enums.js";
import ExcelJs from 'exceljs'
import path from "path";
import fs from 'fs'
import { fileURLToPath } from "url";
import { checkAccess } from "../jobModule/helpers/checkAccess.js";

// add company  
export const addCompany = async(req , res , next)=>{
    const user = req.user;
    const { companyEmail , companyName  , HRs} = req.body;
    let isExist = await companyModel.findOne({
        companyEmail
    });
    // check if the company email already exists
    if(isExist)
        return next(new Error('company Email already exist' , {cause : StatusCodes.BAD_REQUEST}));
    isExist = await companyModel.findOne({
        companyName
        });
    // check if the company name already exists
    if(isExist)
        return next(new Error('company name already used' , {cause : StatusCodes.BAD_REQUEST}));
    // update user isOwner to true
    user.isOwner = true;
    if(Array.isArray(HRs) && HRs.length){
        for (let HR of HRs) {
            let findHR = await userModel.findOne({
                _id : HR , deletedAt : null , bannedAt : null
            })
            // check if the HR account is not found
            if(!findHR)
                return next(new Error('HR account not found' , {cause : StatusCodes.NOT_FOUND}))
            // update HR isHr to true
            findHR.isHr = true;
            // save HR
            await findHR.save()
        }
    }
    // create company       
    const result = await Promise.all([
        companyModel.create({
        ...req.body , createdBy : user._id
        })
        , user.save()])

    return res.status(StatusCodes.ACCEPTED).json({success:true , company:result[0]})
}

// update company
export const updateCompany =async(req , res , next)=>{
    const user = req.user;
    const {companyId} = req.params;
    const {HRs} = req.body
    const company = await companyModel.findOne({
        _id : companyId,
        bannedAt : null
    })
    // check if the target company is not found
    if(!company)
        return next(new Error('company not found' , {cause : StatusCodes.NOT_FOUND}));
    // check if the user is not allowed to update the target company
    if(company.createdBy.toString() !== user._id.toString())
        return next(new Error('you are not allowed to update this company information' , {cause: StatusCodes.BAD_REQUEST}));
    // check if the legal attachment is not allowed to be updated
    if(req.body.legalAttachment){
        return next(new Error('legal attachment can not be updated' , {cause: StatusCodes.BAD_REQUEST}));
    }
    // update company address
    company.address = req.body.address || company.address;
    // update company description
    company.description = req.body.description || company.description;
    // update company industry
    company.industry = req.body.industry || company.industry;
    // update company number of employees
    company.numberOfEmployees = req.body.numberOfEmployees || company.numberOfEmployees;
    // check if the HRs are allowed to be updated
    if(Array.isArray(HRs) && HRs.length){
        const companyHRs = company.HRs.map(hr => hr.toString())
        for (let HR of HRs) {
            let findHR = await userModel.findOne({
                _id : HR , deletedAt : null , bannedAt : null
            })
            // check if the HR account is not found
            if(!findHR)
                return next(new Error('HR account not found' , {cause : StatusCodes.NOT_FOUND}))
            // check if the HR works in the target company
            if(companyHRs.find(e=> e === HR.toString()))
                return next(new Error('HR works in your company' , {cause : StatusCodes.NOT_FOUND}))
            // update HR isHr to true
            findHR.isHr = true;
            // save HR
            await findHR.save()
        }
    }
    // check if the company email is allowed to be updated
    if(req.body.companyEmail){
        let isExist = await companyModel.findOne({
            companyEmail:req.body.companyEmail
        });
        // check if the company email already exists
        if(isExist)
            return next(new Error('company Email already exist' , {cause : StatusCodes.BAD_REQUEST}));
        // update company email
        company.companyEmail = req.body.companyEmail
    }

    // check if the company name is allowed to be updated
    if(req.body.companyName){
        let isExist = await companyModel.findOne({
            companyName:req.body.companyName
        });
        // check if the company name already exists
        if(isExist)
            return next(new Error('company name already exist' , {cause : StatusCodes.BAD_REQUEST}));
        // update company name
        company.companyName = req.body.companyName
    }
    // check if the createdBy is allowed to be updated
    if(req.body.createdBy){
        const targetUser = await userModel.findOne({
            _id : req.body.createdBy,
            isConfirmed : true,
            deletedAt : null
        });
        // check if the target user is not found
        if(!targetUser)
            return next(new Error('user not found' , {cause : StatusCodes.NOT_FOUND}));
        // update company createdBy
        company.createdBy = targetUser._id
    }
    // save company
    await company.save();
    return res.status(StatusCodes.ACCEPTED).json({success : true , company})
}

// get company with name
export const getCompanyWithName = async(req , res ,next)=>{
    const {companyName} = req.params
    const company = await companyModel.findOne({
        companyName
    })
    if(!company)
        return next(new Error('company not found ' , {cause : StatusCodes.NOT_FOUND}));
    return res.status(StatusCodes.ACCEPTED).json({success:true , company})
}

// get company and related jobs
export const getCompanyAndRelatedJobs = async(req , res , next)=>{
    const {companyId} = req.params;
    const company = await companyModel.findOne({
        _id : companyId , deletedAt : null , bannedAt : null
    }).populate('Jobs')
    if(!company)
        return next(new Error('company not found' , {cause : StatusCodes.NOT_FOUND}));
    company.populate({
        path:'Jobs'
    })
    return res.status(StatusCodes.ACCEPTED).json({success : true , company})
}

// upload logo

export const uploadLogo = async(req , res ,next)=>{
const file = req.file
const user = req.user   
// check if the image is required
if (!file) {
    return next(new Error('image is required', { cause: StatusCodes.BAD_REQUEST }));
}
const {companyId} = req.params
// check if the target company is not found
const company = await companyModel.findOne({
    _id : companyId , deletedAt : null , bannedAt : null
})
// check if the target company is not found
if(!company)
    return next(new Error('company not found ' , {cause : StatusCodes.NOT_FOUND}));
// check if the user is not allowed to edit the target company logo
if(user._id.toString() !== company.createdBy.toString())
    return next(new Error('you not allowed to edit this company logo' , {cause : StatusCodes.BAD_REQUEST}));
// upload logo to cloudinary
const{secure_url , public_id} = await cloudinary.uploader.upload(file.path , {
    folder : `companies/company/${company.companyName}/logo`
});
// update company logo
company.logo = {
    secure_url , public_id
};
// save company
await company.save();
return res.status(StatusCodes.ACCEPTED).json({success:true , company})

}

// upload cover picture
export const uploadCovePic = async(req , res ,next)=>{
    const file = req.file
    const user = req.user
    // check if the image is required
    if (!file) {
        return next(new Error('image is required', { cause: StatusCodes.BAD_REQUEST }));
    }
    const {companyId} = req.params
    const company = await companyModel.findOne({
        _id : companyId , deletedAt : null , bannedAt : null
    })
    // check if the target company is not found
    if(!company)
        return next(new Error('company not found ' , {cause : StatusCodes.NOT_FOUND}));
    // check if the user is not allowed to edit the target company cover picture
    if(user._id.toString()!==company.createdBy.toString())
        return next(new Error('you not allowed to edit this company cover picture' , {cause : StatusCodes.BAD_REQUEST}));
    // upload cover picture to cloudinary
    const{secure_url , public_id} = await cloudinary.uploader.upload(file.path , {
        folder : `companies/company/${company.companyName}/coverPic`
    });
    // update company cover picture
    company.coverPic = {
        secure_url , public_id
    };
    // save company
    await company.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , company})
    
    }

// delete logo
export const deleteLogo = async(req , res ,next)=>{
    const user = req.user
    const {companyId} = req.params
    const company = await companyModel.findOne({
        _id : companyId , deletedAt : null , bannedAt : null
    })
    // check if the target company is not found
    if(!company)
        return next(new Error('company not found ' , {cause : StatusCodes.NOT_FOUND}));
    // check if the user is not allowed to edit the target company logo
    if(user._id.toString()!==company.createdBy.toString())
        return next(new Error('you not allowed to edit this company cover picture' , {cause : StatusCodes.BAD_REQUEST}));
    // check if the target company logo is not found
    if(!Object.values(company.logo).length) 
        return next(new Error('profile picture not found' ,{cause:StatusCodes.NOT_FOUND}));
    // delete logo from cloudinary      
    await cloudinary.uploader.destroy(company.logo.public_id);
    // update company logo
    company.logo = {
            secure_url : undefined ,
            public_id : undefined
    };
    // save company
    await company.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , company})
}

// delete cover picture
export const deleteCoverPic = async(req , res ,next)=>{
    const user = req.user
    const {companyId} = req.params
    const company = await companyModel.findOne({
        _id : companyId , deletedAt : null , bannedAt : null
    })
    // check if the target company is not found
    if(!company)
        return next(new Error('company not found ' , {cause : StatusCodes.NOT_FOUND}));
    // check if the user is not allowed to edit the target company cover picture
    if(user._id.toString()!==company.createdBy.toString())
        return next(new Error('you not allowed to edit this company cover picture' , {cause : StatusCodes.BAD_REQUEST}));
    // check if the target company cover picture is not found
    if(!Object.values(company.coverPic).length) 
        return next(new Error('profile picture not found' ,{cause:StatusCodes.NOT_FOUND}));
    // delete cover picture from cloudinary     
    await cloudinary.uploader.destroy(company.coverPic.public_id);
    // update company cover picture
    company.coverPic = {
            secure_url : undefined ,
            public_id : undefined
    };
    // save company
    await company.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , company})
}

// soft delete company              
export const softDeleteCompany = async(req , res , next)=>{
    const user = req.user;
    const {companyId} = req.params
    const company = await companyModel.findOne({
        _id : companyId , deletedAt : null , bannedAt : null
    }).populate([
        {
            path: 'Jobs',
            populate:{
                path:"Applications"
            }
        },
        {
            path:'HRs'
        }
    ])
    if(!company.createdBy.toString()!==user._id.toString() && user.role !== Roles.ADMIN)
        return next('you are not allowed to delete this job')
    if(company.HRs.length){
        for (const HR of HRs) {
            HR.deletedAt = Date.now()
            await HR.save();
        }
    }

    if(company.Jobs.length){
        for (const job of Jobs) {
            if (job.Applications && job.Applications.length) {
                for (const app of job.Applications) {
                    app.deleteAt  = Date.now();
                    await app.save()
                }
                }
            job.deletedAt = Date.now()
            await job.save();
        }
    }

    company.deletedAt = Date.now();
    return res.status(StatusCodes.ACCEPTED).json({company})
}


export const saveAppToExcelSheet = async(req , res , next)=>{
    const {companyId } = req.params;
    const {user} = req.user
    const date = new Date(req.body.date);
    const company = await companyModel.findOne({
        _id : companyId , bannedAt : null , deletedAt : null
    }).populate([
        {
            path: 'Jobs',
            populate:{
                path:"Applications",
                populate:[
                    {
                        path : 'userId'
                    },
                    {
                        path:'jobId'
                    }
                ]
            }
        }
    ])
    if(!company)
        return next(new Error('company not found' , {cause: StatusCodes.NOT_FOUND}))
    if(!checkAccess(user , company))
        return next(new Error('you are not allowed to access this end point' , {cause: StatusCodes.BAD_REQUEST}))
    let applications = [];
    const Jobs = company.Jobs;
    for (const job of Jobs) {
        applications = [...applications , ...job.Applications]
    }
    applications.filter(app => app.createdAt.toISOString() === date.toISOString())
    if (!applications.length) {
        return next(new Error( "No applications found for this company in this day" , {cause:StatusCodes.NOT_FOUND}));
    }

    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet("Applications");

    worksheet.columns = [
        { header: "ID", key: "_id", width: 30},
        { header: "userName", key: "userName", width: 30},
        { header: "Email", key: "email", width: 30},
        { header: "jobTitle", key: "jobTitle", width: 30},
        { header: "Status", key: "status", width: 30},
    ];


    applications.forEach((app) => {
        worksheet.addRow({
            _id: app._id.toString(),
            userName:app.userId.userName,
            jobTitle: app.jobId.jobTitle,
            email: app.userId.email,
            status: app.status,
            createdAt: app.createdAt.toISOString().split("T")[0],
        });
    });
    const __fileName = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__fileName)
    if(!__dirname)
        fs.mkdir(__dirname,{recursive : true})
    const filePath = path.join(__dirname, `applications-${companyId}-${date.toISOString().split('T')[0]}.xlsx`);
    await workbook.xlsx.writeFile(filePath);
    console.log('done' , filePath);
    

    return res.download(filePath, () => {
        fs.unlinkSync(filePath); 
    });

}