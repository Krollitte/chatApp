const {
  addMessage,
  getAllMessage,
} = require("../controllers/messagesController");

const router = require("express").Router();

router.post("/addMessage", addMessage);
router.post("/getMessages", getAllMessage);

module.exports = router;
