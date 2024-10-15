var express = require("express");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var router = express.Router();
var bodyParser = require("body-parser");
var VerifyToken = require("./VerifyToken");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require("../../models/empresa");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const secret = "clavesecreta";

exports.user_create = async function (req, res, next) {
  try {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    let user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.send("Usuario creado ok");
  } catch (err) {
    return next(err);
  }
};

exports.user_login = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("No existe usuario.");

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    }

    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: 86400, // 24 horas
    });

    res.cookie("token", token); // Asignar el token a una cookie
    return res.status(200).send({ auth: true, token: token });
  } catch (err) {
    return res.status(500).send("Error.");
  }
};
