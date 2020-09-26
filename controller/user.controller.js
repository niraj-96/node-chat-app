
const authentication = require('../middleware/authentication');
const mongoose = require('mongoose');

const curent_date = new Date();


let User; 
try {
  User = mongoose.model('users');
} catch (error) {
  User =  require('../model/user.model').getUserModel();
}

const ChatRoom =  require('../model/user.model').getChatRoomModel();
const Chat =  require('../model/user.model').getChatModel();


exports.login = (req,res)=>{

   try{

    if( req.fields!=null){
        let userInfo = req.fields;
        
        let receivedEmail = userInfo.email;
        let receivedPassword = authentication.generateToken(userInfo.password);

        User.find({email:receivedEmail, password:receivedPassword},(err, data)=>{
        if(err){
            res.status(403).json('Not a valid user');
        }else if(data.length>0){

            let userInfo = {
                name: data[0].name,
                email:data[0].email,
                status:data[0].status
            }
            res.status(200).json({token: authentication.generateToken(userInfo)});
        }else{
            res.status(404).json('Invalid Credentials');
        }
    });
    }else{
        res.status(404).json('Object is null');
    }

   }catch(err){
       res.status(500).json('Internal Server Error');
   }

};

exports.createAccount = (req,res) =>{

    let info = req.fields;
    info.password = authentication.generateToken(info.password); 

    let createUser = new User(info);
    createUser.save().then(data=>{
        let userInfo = {
            name: data.name,
            email:data.email,
            status:data.status
        }

        res.status(200).json({token: authentication.generateToken(userInfo)});

    }).catch(err=>res.status(500).json('Internal Server error'));
}

exports.getUserById = (req,res)=>{

    let tokeninfo = JSON.parse(req.headers.token);
    let id =  tokeninfo['_id'];

    User.findById(id,(err,data)=> { if(err){ res.status(404).json([])}else{ 
       
        res.status(200).json({id:data['_id'], name: data['name'], email: data['email']})
    }});

}

//socket functions
exports.activeUsers = async(data)=>{
   
    let allUser = await User.find({});
    allUser = allUser.map(obj=>{
        return {
            id: obj['_id'],
            name: obj['name'],
            email: obj['email']
        }
    })
    return allUser;
}
exports.getMessages = async(data)=>{
    let sendById = data['sendById'];
    let sendToId = data['sendToId'];

    let messageArr = [];
    let chatRoomID = '';
    let roomId = await ChatRoom.findOne({ $and:[{type:'1to1'},{member_id:sendToId},{member_id:sendById}] },{chat_room_id:1});

    if(roomId!=null){
        chatRoomID = roomId['_id'];
        let msgArr = await Chat.find({chat_room_id:chatRoomID});
        for(let obj of msgArr){
            let sender = await User.findById(obj['sendById']);
            let modified = {id:obj['_id'], sendById:obj['sendById'], senderName:sender['name'],  message: obj['msg'], timeStamp: obj['date']}
            messageArr.push(modified);
        }
    
    }

    return messageArr;

}
exports.addChat = async(data)=>{

    let sendById = data['sendById'];
    let sendToId = data['sendToId'];
    let chatPair = [];

    
    chatPair.push(sendById);
    chatPair.push(sendToId);

    let formData = {
        type: data['chat_type'],
        member_id: chatPair
    }

    //check for duplicate here
    let chatRoomID = '';
    let roomId = await ChatRoom.findOne({ $and:[{type:'1to1'},{member_id:sendToId},{member_id:sendById}] },{chat_room_id:1});

    if(roomId!=null){
        chatRoomID = roomId['_id'];
    }else{
        let chatRoomData = new ChatRoom(formData);
        let addedChatRoom = await chatRoomData.save();
        if(addedChatRoom!=null){
            chatRoomID = addedChatRoom['_id'];
        }
    }
   
  
    let chatData = {
        chat_room_id:chatRoomID,
        sendById:sendById,
        sendToId:sendToId,
        msg_type: data['msg_type'],
        msg:data['msg'],
        status:1,
        date:curent_date
    }

    let chatModel = new Chat(chatData);
    let obj = await chatModel.save();

    let sender = await User.findById(obj['sendById']);
    let modified = {id:obj['_id'], sendById:obj['sendById'], senderName:sender['name'],  message: obj['msg'], timeStamp: obj['date']}
    console.log('sendt', modified);
    return modified;

}





