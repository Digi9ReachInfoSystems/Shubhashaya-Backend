const express = require("express");

require("dotenv").config();
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors()); 


const userRoutes = require("./src/routes/userRoutes");
app.use("/users", userRoutes);



app.use("/", (req, res) => {
    res.send("Server is running Healthy");
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});