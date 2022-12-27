const mongoose = require("mongoose");

async function mongoConnect() {
  try {
    await mongoose.connect(
      process.env.MONGO_URL ||
        "mongodb+srv://vishalkrsoni:qwerty123@mymoments.tfu8tan.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        maxPoolSize: 150,
      }
    );
    console.log("Connected to DB ");
  } catch (err) {
    console.log("Error Connecting to DB");
    process.exit();
  }
}
module.exports = {
  mongoConnect,
};

// const mongoConnect = mongoose.connect(`mongodb+srv://vishalkrsoni:qwerty123@mymoments.tfu8tan.mongodb.net/?retryWrites=true&w=majority`, {
// useNewUrlParser: true,
// useUnifiedTopology: true,
// useFindAndModify: false,
// useCreateIndex: true
// }).then(() => {
//     console.log('connected');
//     // console.log(`connected mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.asa7a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
// });

// module.exports = mongoConnect
