export const Roles = {
    USER : 'user',
    ADMIN : 'admin',
}
Object.freeze(Roles);


export const Providers = {
    GOOGLE:'google',
    SYSTEM:'system'
}
Object.freeze(Providers);


export const tokenTypes = {
    ACCESS:'access',
    REFRESH:'refresh'
}
Object.freeze(tokenTypes);

export const Gender = {
    MALE : 'male',
    FEMALE : 'female'
}
Object.freeze(Gender)

export const OTPTypes = {
    CONFIRM_EMAIL:'confirmEmail',
    FORGET_PASSWORD:'forgetPassword'
}
Object.freeze(OTPTypes);

export const subjects={
    CONFIRM_EMAIL:"Confirm Email",
    RESET_PASSWORD:"Reset Password",
    ACCEPT_APP :'ACCEPTED',
    REJECT_APP :'REJECTED',
}
Object.freeze(subjects);

export const FileType={
    IMAGE:['image/apng' , 'image/jpeg' , 'image/png'],
    VIDEO:[],
    PDF:['application/pdf']
}
Object.freeze(FileType)

export const JobLocation = {
    ONSITE :'onsite',
    REMOTELY:'remotely',
    HYBRID:'hybrid'
}

Object.freeze(JobLocation)

export const WorkingTime = {
    PART_TIME:'half-time',
    FULL_TIME :'full-time'
}

Object.freeze(WorkingTime)