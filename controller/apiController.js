const jwt = require("jsonwebtoken");
const service = require("../services/userService");
const Register = async (req, res) =>{
    try {
        const {username, password, imageUrl, name} = req.body;
        const response = await service.registerService(username, password, imageUrl, name);
        if(response.EC != 200){
            return res.status(response.EC).json(response)
        }
        return res.status(200).json(response)
    } catch (e) {
        console.log("Lỗi login: ", e)
        return res.status(500).json({
            EC: 500,
            message:"Lỗi sever"
        })
    }
} 
const Login = async (req, res) => {
    const {username, password} = req.body
    try {
        const response = await service.LoginService(username, password);
        if(response.EC != 200){
            return res.status(response.EC).json(response)
        }

        const payload = {
            username:response.username
        }
        let token = await service.generateTokens(payload);
        return res.status(response.EC).json({
            EC: response.EC,
            message: response.message,
            data:{
                token:token.accessToken
            }
        })
    } catch (error) {
        console.log("L��i login: ", error)
        return res.status(500).json({
            EC: 500,
            message:"Lỗi server: "
        })
    }
}
const GetInfor = async (req, res) => {
    const username = req.para.query.username;
    try {
        const response = await service.getInfor(username);
        if(response.EC== 200){
            return res.status(response.EC).json(response)
        }
        return res.status(404).json({
            EC: 404,
            message: "Không tìm thấy thông tin người dùng"
        })
    } catch (error) {
        console.log("L��i lấy thông tin: ", error)
        return res.status(500).json({
            EC: 500,
            message:"L��i sever: "
        })
    }
}
const updatePassword = async (req, res) => {
    const {username, password, newpassword} = req.body;
    try {
        const response = await service.UpdatePassword(username, password, newpassword);
        if(response?.EC == 200){
            return res.status(response.EC).json(response)
        }
        return res.status(404).json({
            EC: 404,
            message: "Không tìm thấy thông tin người dùng hoặc mật khẩu không đúng"
        })
    } catch (error) {
        console.log("Lỗi sever")
        return res.status(500).json({
            EC: 500,
            message:"L��i sever"
        })
    }
}
const updateInfo = async (req, res) => {
    const {username, name, imageUrl} = req.body;
    try {
        const response = await service.updateInfor(username, name, imageUrl);
        if(response.EC == 200){
            return res.status(response.EC).json(response)
        }
        return res.status(404).json({
            EC: 404,
            message: "Không tìm thấy thông tin người dùng hoặc sữa thất bại"
        })
    } catch (error) {
        console.log("L��i cập nhật thông tin: ", error)
        return res.status(500).json({
            EC: 500,
            message:"L��i sever: "
        })
    }
}
const AddNewBook= async (req, res) => {
    const {title, description, author, imageUrl, category} = req.body;
    try {
        const response = await service.addNewBookService(title, description, author, imageUrl, category);
        return res.status(response.EC).json(response)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EC: 500,
            message:"Lỗi server"
        })
    }
}
const AddNewChapter = async (req, res) => {
    const {bookId, title, content} = req.body;
    try {
        const response = await service.addChapter(bookId, title, content);
        return res.status(response.EC).json(response)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EC: 500,
            message:"L��i server"
        })
    }
}
const GetChapter = async (req, res) => {
    const bookId = req.query.bookId;
    try {
        const response = await service.getChapter(bookId);
        if(response?.EC == 200) {
            return res.status(response.EC).json(response)
        }
        return res.status(404).json({
            EC: 404,
            message:"Không tìm thấy truyện này"
        })
    } catch (error) {
        console.log("Lỗi server")
        return res.status(500).json({
            EC: 500,
            message:"Lỗi server"
        })
    }
}
const GetContentChapter = async (req, res) => {
    const {bookId, No}=req.query;
    try {
        const response = await service.getContentChapter(bookId, No);
        if(response?.EC == 200) {
            return res.status(response.EC).json(response)
        }
        console.log(response)
        return res.status(404).json({
            EC: 404,
            message:"Không tìm thấy truyện này hoặc chap này"
        })
    } catch (error) {
        console.log("Lỗi server")
        return res.status(500).json({
            EC: 500,
            message:"L��i server"
        })
    }
}
const GetBookInNew = async (req, res) => {
    try {
        const response = await service.getBookInNew();
        if(response?.EC == 200){
            return res.status(response.EC).json(response)
        }
        return res.status(404).json({
            EC: 404,
            message:"Không tìm thấy truyện mới nào"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EC: 500,
            message:"L��i server"
        })
    }
}
const GetBookInUpdate = async (req, res) => {
    try {
        const response = await service.getBookInUpdate();
        if(response?.EC == 200){
            return res.status(response.EC).json(response)
        }
        return res.status(404).json({
            EC: 404,
            message:"Không tìm thấy truyện mới nào"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EC: 500,
            message:"L��i server"
        })
    }
}
const GetBookById = async (req, res) => {
    const {bookId} = req.query;
    try {
        const response = await service.getBookById(bookId);
        if(response?.EC == 200) {
            return res.status(response.EC).json(response)
        }
        return res.status(404).json({
            EC: 404,
            message:"Không tìm thấy truyện này"
        })
    } catch (error) {
        console.log("L��i server")
        return res.status(500).json({
            EC: 500,
            message:"L��i server"
        })
    }
}
module.exports ={
    Register,
    Login,
    GetInfor,
    updateInfo,
    updatePassword,
    AddNewBook,
    AddNewChapter,
    GetChapter,
    GetContentChapter,
    GetBookInNew,
    GetBookById,
    GetBookInUpdate
}