const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    await mongoose.connect('mongodb+srv://vatsalribadiya4:dlN4ZNyr0Lq2FHxj@cluster0.5ql4ktz.mongodb.net/iNotebook');
    console.log("Connected Successfully");
  } catch (error) {
    handleError(error);
  }
}

module.exports = connectToMongo;