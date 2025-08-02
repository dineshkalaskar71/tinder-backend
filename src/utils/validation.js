const validatesignupdata = (req) => {
   const { firstName, lastName, password, emailid } = req.body;

   if (!firstName) {
      throw new Error("fname not presnrt")
   } if (!lastName) {
      throw new Error("fname not presnrt")
   }
}


module.exports = validatesignupdata ;