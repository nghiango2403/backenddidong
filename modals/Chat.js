const mongoose = require("mongoose");
const chatSchema = mongoose.Schema(
    {
        userChat:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        content: {
            type: String,
            required: true,
        },
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        },
    },
    { timestamps: true }
);
const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
