// I was just messing around with the user routes to test if everything is working fine, 
// and to have a simple endpoint to test the connection between the server and the database. 
// I will replace this with actual user-related routes (like getting user info, updating user info, etc.) later on.

import express from "express";
const router = express.Router();
router.get("/hello",(req, res) => {
  res.json({ message: "Hello World!" });
});

export default router;