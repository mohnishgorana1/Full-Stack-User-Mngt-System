import Jwt from "jsonwebtoken";

/*
 *   yaha aae ho to mne tumko roka h na
 *   chlo to tumhe user chahiye
 *   user login h mtlb, yani token save
 *   to fir phle token lelo cookies me se or agar nhi mile to return false kr jao
 *   acha mil gya to fir payload me Jwt.verify(token, SECRET)
 *   req.User = { id: payload.id, email: payload.email }
 */

const jwtAuth = (req, res, next) => {
  const token = (req.cookies && req.cookies.token) || null;

  if (!token) {
    return res.send(400).json({
      success: false,
      message: "Not Authorized",
    });
  }

  try {
    const payload = Jwt.verify(token, process.env.SECRET);
    req.User = { id: payload.id, email: payload.email };  // ye request ab getUser ke pass jaegi
  } catch (error) {
    return res.send(400).json({
      success: false,
      message: "Not Authorized",
    });
  }


  next();
};

export default jwtAuth;
