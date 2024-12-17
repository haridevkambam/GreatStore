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

        res.status(201).json({user : {
            name : user.name,
            email : user.email,
            _id : user._id,
            role : user.role,
        }, message : "User created successfully"});

    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

export const login = async (req, res)=>{
    res.send("login route called");
};

export const logout = async (req, res)=>{
    res.send("logout route called");
};

