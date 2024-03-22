const express = require("express");
const sendMessage = require("../controller/sendMessage");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require("../controller/users");
const {
  addPavilion,
  getAllPavilions,
  deletePavilion,
  updatePavilion,
} = require("../controller/pavilions");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post("/sendMessage", sendMessage);

router.get("/getAllUsers", getAllUsers);

router.get("/getUserById/:id", getUserById);

router.delete("/deleteUser/:id", deleteUser);

router.put("/updateUser/:id", updateUser);

router.post("/addPavilion", authenticate, addPavilion);

router.get("/getAllPavilions", authenticate, getAllPavilions);

router.delete("/deletePavilion/:id", authenticate, deletePavilion);

router.put("/updatePavilion/:id", authenticate, updatePavilion);

module.exports = router;
