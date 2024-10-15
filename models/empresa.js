var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EmpresaSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, max: 100 },
  email: String,
  password: String,
  usuarios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  ],
});

module.exports = mongoose.model("Empresa", EmpresaSchema);
