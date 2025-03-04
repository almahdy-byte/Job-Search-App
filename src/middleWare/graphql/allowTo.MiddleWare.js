export const allowTo=(role , ...roles)=>{
if(!roles.includes(role)) throw new Error('you are not allowed to access this end point');
return true;
}