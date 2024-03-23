import express from "express";

const app = express();
app.use(express.json());
app.use(express.static("public"));
//routers

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});