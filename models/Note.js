var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// create a new NoteSchema object

var NoteSchema = new Schema({
  title: String,
  body: String
});

// create model from the above schema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;