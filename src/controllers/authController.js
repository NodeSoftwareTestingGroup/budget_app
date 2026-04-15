//This file contains the controller functions for the authentication routes (signup, login, logout).
// The controller functions handle the logic for each route, such as validating user input, 
// interacting with the database, and generating JWT tokens for authentication.



import { prisma } from "../config/budgetDB.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utilities/generateToken.js";

const signup = async (req, res) => {
    const {name, email, password} = req.body;
    
    // We check to see if the user already exists in the database, if so we return an error message
    // If not, we create a new user in the database and return a success message
    const userExists = await prisma.user.findUnique({
        where: {email: email}
    });
    
    if(userExists){
        return res
        .status(400)
        .json({ error: "User already exists" });
    }


    //Hash the password before storing it in the database
    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user  = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });
    //Generate a JWT token for the user 
    const token = generateToken(user.id,res);

    // Return the created user
    return res.status(201).json({ 
        status: "success",
        data: {
            user: {
                id: user.id,
                name: name,
                email:email,
            },
            token,
        },
    });

};

const login = async (req, res) => {
    // We check to see if the user exists in the database, if not we return an error message
    // If the user exists, we compare the provided password with the hashed password stored in the database
    // If the passwords match, we return a success message, otherwise we return an error message
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({
        where: {email: email}
    });
    if (!user) {
        return res
        .status(401)
        .json({ error: "Invalid email or password" });
    }
    //We need to verify if the provided password matches the hashed password stored in the database
    const isPasswordTrue = await bcrypt.compare(password, user.password);
    if (!isPasswordTrue) {
        return res
        .status(401)
        .json({ error: "Invalid email or password" });
    }
    //Generate a JWT token for the user 
    const token = generateToken(user.id,res);
    // If the passwords match, return a success message
    return res.status(200).json({ 
        status: "success",
        data: {
            user: {
                id: user.id,
                email: user.email,
            },
            token,
        },
    });

};
const logout = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), // Set the cookie to expire in the past to effectively delete it
    });
    res.status(200).json({
        status: "success",
        message: "User logged out successfully"
    });
}

export{ signup, login, logout }