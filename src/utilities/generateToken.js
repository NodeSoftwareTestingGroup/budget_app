import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const payload = { userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { 
        expiresIn: process.env.JWT_EXPIRES_IN ||"7d",
    });
    // Set the token as an HTTP-only cookie in the response to stop 
    // client-side JavaScript from accessing it, which helps prevent XSS attacks.
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks by only sending cookies in same-site requests
        maxAge: 7 * (24 * 60 * 60 * 1000), // Set cookie to expire in 7 days. This format 
                                            // converts 7 days to milliseconds
    });
    return token;
}