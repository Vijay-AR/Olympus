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
        const data = User.inbox
        res.json({data})
    }catch(err){
        res.json("user not found")
    }
}


const addBadges = async(req,res)=>{
    const {img} = req.body
    const {id} = req.params
    try{
        const User = await user.findOneAndUpdate(
            {_id: id},
            { $push: { badges: img } },
            { new: true } 
        );
        res.status(200).json({ User });

    }catch(err){
        console.error(err)
        res.json({message: "Server Error at uploading badge"}).status(500)
    }
}

const getBadges =async(req,res)=>{
    const {id} = req.params
    try{
        const User = await user.findOne({_id : id})
        const badges = User.badges;
        res.status(200).json({ badges });
    }catch(err){
        console.error(err)
        res.json({message: "Server Error at fetching badge"}).status(500)
    }
}

module.exports = {profileImage, getInbox, addBadges, getBadges}