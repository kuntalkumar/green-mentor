

const mongoose = require("mongoose");
const TodoSchema = mongoose.Schema({
    title : {
        type : String,
        required : true 
    },
    description : {
        type : String,
        required : true 
    }
})

const TodoModel = mongoose.model("todo", TodoSchema);
module.exports = {
    TodoModel
}


