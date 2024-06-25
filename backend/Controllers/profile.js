const user = require('../models/user')

const profileImage = async(req, res)=>{
    const {ImageUrl} = req.body;
    const {id} = req.params
    try{
        const image = await user.findOneAndUpdate({_id : id }, {$set:{image : ImageUrl}}, {new: true})
        res.json({message:'Profile Photo Updated'},image).status(200);

    }catch(err){
        console.error(err)
        res.json({message: "Server Error at uploading profile"}).status(500)
    }
}
const getInbox = async(req,res)=>{
    const {userId} = req.params
    try{
        const User= await user.findOne({_id: userId})
        const data = User
        res.json(data)
    }catch(err){
        res.json("user not found")
    }
}
module.exports = {profileImage, getInbox}