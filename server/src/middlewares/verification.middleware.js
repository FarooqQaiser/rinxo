

import jwt from "jsonwebtoken";

export const verification = (req, res, next) => {
  const userCheck = req.user
 
  console.log(userCheck)
  if (!userCheck) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
      
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "User invalid or expired" });
  }
};
