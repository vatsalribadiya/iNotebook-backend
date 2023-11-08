const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    title:{
        type: String,
        required : true
    },
    description:{
        type: String,
        required : true,
        // unique: true
    },
    tag:{
        type: String,
        default : "general"
    },
    date:{
        type: Date,
        default : Date.now
    },
  });

  const Note =  mongoose.model('note', noteSchema);
  module.exports = Note;