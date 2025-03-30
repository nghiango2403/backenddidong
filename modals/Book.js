const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
    },
    author:{
        type:String,
    },
    imageUrl:{
        type:String,
    },
    category: {
        type: String,
        required: true,
      },
    views: {
        type: Number,
        default: 0,
    },
    quantity:{
        type: Number,
        default:0
    },
    status:{
        type: String,
        default: "Còn tiếp",
        enum: ["Hoàn thành", "Còn tiếp", "Tạm ngưng"],
    },
    
},{
    timestamps:true
})

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;