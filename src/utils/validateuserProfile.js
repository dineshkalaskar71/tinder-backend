const validateuserProfile = (req) => {
   const allowedfields = [
      "firstName",
      "skills"
   ];

   const isEditallow = Object.keys(req.body).every((fields) =>
      allowedfields.includes(fields)
   )
   console.log(isEditallow);
   
   return isEditallow
}
module.exports = validateuserProfile