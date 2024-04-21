const express = require("express");
const { RegisterModel } = require("../models/register.model");
const { ChatModel } = require("../models/chat.model");
const { MessageModel } = require("../models/message.model");
// const { CommentModel } = require('../models/comment.model');

const chatRouter = express.Router();

chatRouter.get("/:id", async (req, res) => {
  const UserDetails = req.body.UserDetails;
  const UserID = UserDetails.UserID;
  const ID = req.params.id;
  const room = `${UserID}${ID}`.split("").sort().join("");
  try {
    const message = await MessageModel.findOne({ room });
    let read = false;
    if (!message) {
      read = true;
    } else {
      read = message.read;
    }

    const ProfileUser = await RegisterModel.findOne({ _id: ID });
    let chats = await ChatModel.find({ room })
      .sort({ CreatedAt: -1 })
      .limit(20)
      .sort({ CreatedAt: 1 });

      // console.log(chats,read)

    res.render("chat", {
      UserDetails: req.body.UserDetails,
      ProfileUser: {
        UserID: ProfileUser._id,
        UserName: ProfileUser.name,
        UserDp: ProfileUser.dp,
      },
      room,
      chats,
      read,
    });
  } catch (error) {
    return res.redirect("/");
  }
});

chatRouter.post("/", async (req, res) => {
  const payload = {
    UserDetails: req.body.UserDetails,
    text: req.body.text,
    room: req.body.room,
  };
  try {
    const chat = new ChatModel(payload);
    await chat.save();

    res.status(201).json({ ok: true });
  } catch (error) {
    res.status(400).json({ err: error });
  }
});

module.exports = { chatRouter };
