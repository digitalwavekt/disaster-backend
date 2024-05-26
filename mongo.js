const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/DisasterManagement');
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log("mongodb not connected");
}
)


const newSchema = new mongoose.Schema({
    name:(
        type:Number,
        required:true
    ),
    email:(
        type:Number,
        required:true
    ),
    phone:(
        type:Number,
        required:true
    ),
    password:(
        type:Number,
        required:true
    )
})

const collection = mongoose.model('collection',newSchema);

module.exports = collection