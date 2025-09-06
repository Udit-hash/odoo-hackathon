const express=require("express");
const cors=require("cors");
const MainRouter=require("./index.js");

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/v1",MainRouter);

app.listen(3001,()=>{
    console.log("Server connected");
});
