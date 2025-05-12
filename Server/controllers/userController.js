import userModel from "../models/userModel.js";

export const getUserData= async (req,res)=>{
    try {
        const {userId}=req.body;
        console.log(userId);
        const user = await userModel.findOne({_id:userId});
        
        if(!user)
            return res.send({ status: false, message: "User not found!" });

        res.send({ status: true, 
            userData: {
                name:user.name,
                email:user.email,
                isAccountVerified:user.isAccountVerified
        }});

    } catch (error) { 
        res.send({ status: false, message: error.message });
    }
}