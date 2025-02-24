const express = require("express");
const connectToDb = require("./dbConfig");

///////////////
const app = express();
const port = 8000;

app.use(express.json());
app.use("/user",require("./routes/UserRoute"));
 
///////////////
app.listen(port, () => {
  console.log(`Server is up at port: ${port}`);
});

connectToDb();
