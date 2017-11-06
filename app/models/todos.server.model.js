// Required in /app/config/mongoose.js

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Set up Mapping Schema
// ==============================
var TodoSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: "Please enter mapping name "
  },
  comment: {
    type: String,
    default: '',
    trim: true
  },
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  completed: {
    type: Boolean,
    default: false
  },
    mappings : [{
        hl7 : String,
        fhir : String
    }],

    mappings2 : { type : Array , "default" : [] }
});

module.exports = mongoose.model('Todo', TodoSchema);

/*
mappings : [{
lat : String,
    lng : String
}]
*/
