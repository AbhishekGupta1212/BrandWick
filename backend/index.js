const express = require("express");
const cors = require("cors");
const {connection} = require("./connection")
const { userRouter } = require("./Controller/userRoute");


const app = express();
app.use(express.json());
app.use(cors());

app.use('/user', userRouter);

app.get("/",(req,res)=>{
    res.send("Welcome")
})

app.listen(`${process.env.PORT}`,async()=>{
    try {
        await connection;
        console.log('Server is connected with DB');
        console.log(`Server is running on ${process.env.PORT}.`);
    } catch (error) {
        console.log(error)
    }
})