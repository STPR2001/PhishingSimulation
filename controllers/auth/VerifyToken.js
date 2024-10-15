var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");

const secret = "clavesecreta";

exports.verifyToken = function (req, res, next) {
  var token = req.cookie.token;
  //var token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "Sin token." });
  jwt.verify(token, secret, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Error al autenticar token" });
    req.userId = decoded.id;
    next();
  });
};
