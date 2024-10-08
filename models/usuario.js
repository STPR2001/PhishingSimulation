var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nombre: { type: String, max: 100 },
  apellido: { type: String, max: 100 },
  correo: { type: String, unique: true, max: 100 },
});

module.exports = mongoose.model("Usuario", UserSchema);
