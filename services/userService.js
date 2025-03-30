const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../modals/User");
const Book = require("../modals/Book");
const Chapter = require("../modals/Chapter");
const Chat = require("../modals/Chat");
const salt = 10;

const generateTokens = async (payload) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });
    return { accessToken };
  
};
const isvalidUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error in check valid Username: ", error);
    return false;
  }
};
const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};
const registerService = async (
    username, password, imageUrl, name
)=>{
    let checkUsername = await isvalidUsername(username);
    if (checkUsername) {
        return {
          EC: 1,
          message: "Email or username already exists",
          data: "",
        };
      }
    const hashedPassword = hashPassword(password);
    try {
        const data = await User.create({
            username: username,
            password: hashedPassword,
            imageUrl,
            name: name
          });
          if (data) {
            return {
              EC: 200,
              message: "Thành công",
              data: {
                username: username,
                name:name,
              },
            };
          } else {
            return {
              EC: 500,
              message: "Lỗi khi tạo tài khoản",
              data: "",
            };
          }
    } catch (error) {
        console.log("Lỗi server")
        return {
            EC: 500,
            message: "Server Error",
            data: "",
        }
    }
}
const LoginService = async (username, password) => {
    try {
        let response = await User.findOne({ username });
        if (response && bcrypt.compareSync(password, response.password)) {
          return {
            EC: 200,
            message: "Đăng nhập thành công",
            data: response,
          };
        } else {
          return {
            EC: 500,
            message: "Đăng nhập thất bại",
            data: "",
          };
        }
      } catch (err) {
        console.log("Error when login: ", err);
        return {
          EC: 500,
          message: "Error when login",
          data: "",
        };
      }
}
const getInfor = async (username)=>{
  try {
        let response = await User.findOne({ username: username }).select("name imageUrl");
        // console.log(response)
        if (response) {
          return {
            EC: 200,
            message: "Thành công",
            data: response,
          };
        } else {
          return {
            EC: 500,
            message: "Tài khoản không tồn tại",
            data: "",
          };
        }
      } catch (err) {
        console.log("Error when get infor: ", err);
        return {
          EC: 500,
          message: "Error when get infor",
          data: "",
        };
      }
}
const UpdatePassword = async (username, password, newpassword)=>{
  try {
    console.log("g")
    let response = await User.findOne({ username });
    console.log(bcrypt.compareSync(password, response.password));
    if (!bcrypt.compareSync(password, response.password)) {
          return {
            EC: 500,
          };
        }
    console.log("a")
    let hashedPassword = hashPassword(newpassword);
    let responsewithupdate = await User.findOneAndUpdate({username}, {$set:{password:hashedPassword}})
    if (responsewithupdate) {
      console.log("b")
      return{
        EC: 200,
        message: "Đổi mật khẩu thành công",
        data: "",
      }
    }
    console.log("c: ", responsewithupdate)
    return {
      EC: 500
    }
  } catch (error) {

    console.log("Lỗi khi đổi mk")
    return {
      EC:500
    }
  }
}
const updateInfor = async (username, name, imageUrl)=>{
  try {
        let response = await User.findOneAndUpdate(
          { username: username }, { $set: { name: name, imageUrl: imageUrl } }, { new: true, fields: "name imageUrl" } 
        );
        // console.log(response)
        if (response) {
          return {
            EC: 200,
            message: "Thành công",
            data: response,
          };
        } else {
          return {
            EC: 500,
            message: "Tài khoản không tồn tại",
            data: "",
          };
        }
      } catch (err) {
        console.log("Error when update infor: ", err);
        return {
          EC: 500,
          message: "Error when update infor",
          data: "",
        };
      }
}
const addNewBookService = async (title, description, author, imageUrl, category)=>{
    try {
        const data = await Book.create({
            title,
            description,
            author,
            imageUrl,
            category,
        })
        if (data) {
            return {
              EC: 200,
              message: "Thành công",
              data: {
                data
              },
            };
          } else {
            return {
              EC: 500,
              message: "Lỗi khi tạo sách",
              data: "",
            };
          }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            message: "Lỗi server",
            data: "",
        }
    }
}
const addChapter = async (bookId, title, content) => {
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return {
        EC: 404,
        message: "sách muốn thêm chương không tồn tại",
        data: "",
      };
    }
    const chapter = await Chapter.create({
      No: book.quantity+1,
      title: title,
      content: content,
      bookId: bookId,
      prev: book.quantity==0?null:book.quantity,
    });
    if (!chapter) {
      return {
        EC: 500,
        message: "Lỗi khi thêm chương",
        data: "",
      };
    }
    const update = await Book.findByIdAndUpdate(
      bookId,
      { $inc: { quantity: 1 } },
      { new: true }
    );
    if (!update) {
        return {
          EC: 500,
          message:
            "Lỗi khi cập nhật số chương",
          data: "",
        };
      }
    if (book.quantity > 0) {
      const updatePrevChapter = await Chapter.findOneAndUpdate(
        {
          bookId: bookId,
          No: book.quantity,
        },
        { next: book.quantity + 1 },
        { new: true }
      );
      if (!updatePrevChapter) {
        return {
          EC: 500,
          message: "Lỗi khi sữa link tiếp theo chương trước",
          data: "",
        };
      }
    }
    return {
      EC: 200,
      message: "Thêm chương thành công",
      data: chapter,
    };
  } catch (error) {
    console.log("Lỗi ở thêm chương: ", error);
    return {
      EC: 500,
      message: "Lỗi khi thêm chương1",
      data: "",
    };
  }
};
const getChapter = async (bookId)=>{
  try {
    const chapter = await Chapter.find({bookId: bookId}).select("No title createdAt");
    if(chapter){
      return {
        EC: 200,
        message: "Lấy thành công",
        data: chapter,
      }
    }
    return {
      EC: 404,
      message: "Chương không tồn tại",
      data: "",
    }
  } catch (error) {
    console.log("Lỗi khi lấy chương");
    return{
      EC: 500,
      message: "Lỗi khi lấy chương",
      data: "",
    }
  }
}
const getContentChapter = async (bookId, No)=>{
  try {
    const content = await Chapter.find({bookId: bookId, No: No}).select("content");
    console.log("a")
    if(content){
      return {
        EC: 200,
        message: "Lấy thành công",
        data: content,
      }
    }
    return {
      EC: 404,
      message: "Chương không tồn tại",
      data: "",
    }
  } catch (error) {
    console.log("Lỗi khi lấy nội dung chương");
    return{
      EC: 500,
      message: "Lỗi khi lấy nội dung chương",
      data: "",
    }
  }
}
const getBookInNew = async ()=>{
  try {
    const listBook = await Book.find().select("title imageUrl category quantity author").sort({createdAt: -1})
    if(listBook){
      return {
        EC: 200,
        message: "Lấy thành công",
        data: listBook,
      }
    }
    return {
      EC: 404,
      message: "Không tìm thấy sách nào",
      data: "",
    }
  } catch (error) {
    console.log("L��i khi lấy sách mới");
    return {
      EC: 500,
      message: "L��i khi lấy sách mới",
      data: "",
    }
  }
}
const getBookInUpdate = async ()=>{
  try {
    const listBook = await Book.find().select("title imageUrl category quantity author").sort({updateAt: -1})
    if(listBook){
      return {
        EC: 200,
        message: "Lấy thành công",
        data: listBook,
      }
    }
    return {
      EC: 404,
      message: "Không tìm thấy sách nào",
      data: "",
    }
  } catch (error) {
    console.log("L��i khi lấy sách mới");
    return {
      EC: 500,
      message: "L��i khi lấy sách mới",
      data: "",
    }
  }
}
const getBookById = async (bookId)=>{
  try {
    const book = await Book.findById(bookId);
    if(book){
      return {
        EC: 200,
        message: "Lấy thành công",
        data: book,
      }
    }
    return {
      EC: 404,
      message: "Sách không tồn tại",
      data: "",
    }
  } catch (error) {
    console.log("Lỗi khi lấy thông tin sách")
    return {
      EC: 500,
      message: "L��i khi lấy thông tin sách",
      data: "",
    }
  }
}
module.exports={
    registerService,
    LoginService,
    generateTokens,
    getInfor,
    updateInfor,
    UpdatePassword,
    addNewBookService,
    addChapter,
    getChapter,
    getContentChapter,
    getBookInNew,
    getBookById,
    getBookInUpdate,
}