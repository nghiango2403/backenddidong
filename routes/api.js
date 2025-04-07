const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const controller = require("../controller/apiController");

const initApiRoutes = (app) => {
    // router.all("*", auth);
    // router.post("/login", apiController.Login);
    // router.post("/register", apiController.Register);
    router.post("/addbook", controller.AddNewBook)
    router.post("/register", controller.Register)
    router.post("/login", controller.Login)
    router.get("/getinfo", controller.GetInfor)
    router.put("/updateinfo", controller.updateInfo)
    router.put("/updatepassword", controller.updatePassword)
    router.post("/addchapter", controller.AddNewChapter)
    router.get("/getchapter", controller.GetChapter)
    router.get("/getcontentchapter", controller.GetContentChapter)
    router.get("/getnewbook", controller.GetBookInNew)
    router.get("/getfullbook", controller.GetBookInFull)
    router.get("/getupdatebook", controller.GetBookInUpdate)
    router.get("/getbookbyid", controller.GetBookById)
    router.post("/addchat", controller.AddChat)
    router.get("/getchat", controller.GetChat)
    router.get("/search", controller.SearchBook)
    return app.use("/v1/api/", router);
  };
  
  module.exports = initApiRoutes;