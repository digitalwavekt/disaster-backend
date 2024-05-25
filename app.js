const express = require('express');
const collection = require('./mongo');
const cors = require('cors');
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


app.get('/',cors(), (req, res) => {
})

app.post("/" ,async (req, res) => {
    const (mobile,otp ) = req.body

    try{
        const check=await collection.findOne({mobile:mobile})
        if(check){
            if(check.otp===otp){
                res.send("correct")
            }
            else{
                res.send("incorrect")
            }
        }
        else{
            res.send("not registered")

    }
catch(e){
    res.json ("notexist")

}

})


app.post("/signup" ,async (req, res) => {
    const (mobile,otp ) = req.body

    const data=(
        email:email,
        name :name,
        phone:phone
        
        
    )

    try{
        const check=await collection.findOne({mobile:mobile})
        if(check){
            if(check.otp===otp){
                res.send("correct")
            }
            else{
                res.send("incorrect")
                await collection.insertMany([data])
            }
        }
        else{
            res.send("not registered")

    }
catch(e){
    res.json ("notexist")




app.listen(5000, () => {
    console.log("server started")

})