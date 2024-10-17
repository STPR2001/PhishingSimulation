var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CorreoSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  asunto: { type: String, required: true, max: 100 },
  contenido: String,
});

module.exports = mongoose.model("Correo", CorreoSchema);
