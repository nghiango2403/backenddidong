const mongoose = require("mongoose");
const chapterSchema = mongoose.Schema(
    {
        No: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        },
        next: {
            type: Number,
            default: 0,
        },
        prev: {
            type: Number,
        },
    },
    { timestamps: true }
);
const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;
