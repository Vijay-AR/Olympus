module.exports =  (req, res)=>{
    req.logout();
    //* checkout this line | as it can be used to clear out the user detail from the browser
    // res.clearCookie("connect.sid") //?
    res.status(200).json({"message" : "Logged out succesfully"})
    // res.send("Loggout Succesful")
    res.redirect('/auth/login')
    //*these are not working in thunder client
  }