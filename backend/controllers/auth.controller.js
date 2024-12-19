import {redis} from "../lib/redis.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

const generateTokens = (userid) =>{
    const accessToken = jwt.sign({userid}, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "15m"});  
    const refreshToken = jwt.sign({userid}, process.env.REFRESH_TOKEN_SECRET, {expiresIn : "7d"});

    return {accessToken, refreshToken};
}

const storeRefreshToken = async (userid, refreshToken) => {
    await redis.set(`refreshToken:${userid}`, refreshToken, "EX", 7 * 24 * 60 * 60);
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly : true, // prevent XSS Attacks
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict", // prevent CSRF Attacks
        maxAge : 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly : true, // prevent XSS Attacks
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict", // prevent CSRF Attacks
        maxAge : 7 * 24 * 60 * 60 * 1000
    });
    
};

export const signup = async (req, res)=>{
    const {name, email, password} = req.body;

    try {
        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({message : "User already exists"});
        }
        const user = await User.create({name, email, password});

        const {accessToken, refreshToken} = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            name : user.name,
            email : user.email,
            _id : user._id,
            role : user.role,
        });

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message : error.message});
    }
};

export const login = async (req, res)=>{
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(user && (await user.comparePassword(password))){
            const {accessToken, refreshToken} = generateTokens(user._id);

            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.status(200).json({
                name : user.name,
                email : user.email,
                _id : user._id,
                role : user.role
            });
        }
        else{
            res.status(401).json({message : "Invalid credentials"});
        }
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message : error.message});
    }
};

export const logout = async (req, res)=>{
    try {
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken){
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refreshToken:${decoded.userid}`);
            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            res.status(200).json({message : "Logout successful"});
        }
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message : "Server Error", error : error.message});
    }
};

export const refreshToken = async (req, res)=> {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({message : "Refresh Token is not provided"});
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refreshToken:${decoded.userid}`);

        if(storedToken !== refreshToken){
            return res.status(401).json({message : "Invalid Refresh Token"});
        }

        const accessToken = jwt.sign({userid : decoded.userid}, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "15m"});

        res.cookie("accessToken", accessToken, {
            httpOnly : true, // prevent XSS Attacks
            secure : process.env.NODE_ENV === "production",
            sameSite : "strict", // prevent CSRF Attacks
            maxAge : 15 * 60 * 1000
        });

        res.json({message : "Token refreshed successfully"});

    } catch (error) {
        console.log("Error in refresh token controller", error.message);
        res.status(500).json({message : "Server Error", error : error.message});
    }
}

// export const getProfile = async (req, res)=> {
//     try {
        
//     } catch (error) {
        
//     }
// }
