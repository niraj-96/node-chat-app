const mongoose = require('mongoose');

exports.getUserModel = ()=>{

    const user = mongoose.Schema({
        email:{ type: String, required: true, unique: true},
        name: { type: String, required: true},
        password: {type: String, required: true},
        status : {type: Number, default:1}
    });

    return mongoose.model('users', user);
},

exports.getChatRoomModel = ()=>{

    const chatroom = mongoose.Schema({
        type:{ type:String, required:true},
        is_group:{type:Boolean, default:false},
        member_id: {type:Array, required:true, default:[]}
    });

    return mongoose.model('chatroom', chatroom);
}

exports.getChatModel = ()=>{

    const chat = mongoose.Schema({
        chat_room_id:{ type:String, required:true},
        sendById: { type:String, required:true},
        sendToId: { type:String, required:true},
        msg_type:{type:String, required:true},
        msg: {type:String, required:true},
        status:{type:Number, default:0},
        date:{type:String}
    });

    return mongoose.model('chat', chat);
}