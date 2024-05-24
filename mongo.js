const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/DisasterManagement');
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console
}
)


const newSchema = new mongoose.Schema({
    mobile:(
        type:Number,
        required:true
    )
    otp:(
        type:Number,
        required:true
    )
})

const collection = mongoose.model('collection',newSchema);

module.exports = collection