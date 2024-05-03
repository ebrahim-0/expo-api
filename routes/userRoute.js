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
  getPavilionByCountry,
} = require("../controller/pavilions");
const { authenticate } = require("../middlewares/auth");
const {
  addPavilionsReviews,
  getPavilionReviews,
} = require("../controller/pavilionsReviews");
const {
  addFacility,
  getAllFacilities,
  deleteFacility,
  updateFacility,
} = require("../controller/facility");
const {
  addShowTime,
  getAllShowTimes,
  deleteShowTime,
  updateShowTime,
} = require("../controller/showTime");
const {
  bookTickets,
  getTicketUser,
  getAllTickets,
  deleteTicket,
} = require("../controller/ticket");
const { payment, payDone } = require("../controller/stripe");

const router = express.Router();

router.post("/sendMessage", sendMessage);

router.get("/getAllUsers", getAllUsers);

router.get("/getUserById/:id", getUserById);

router.delete("/deleteUser/:id", deleteUser);

router.put("/updateUser/:id", updateUser);

router.post("/addPavilion", authenticate, addPavilion);

router.get("/getAllPavilions", getAllPavilions);

router.get("/getPavilionByCountry/:country", getPavilionByCountry);

router.delete("/deletePavilion/:id", authenticate, deletePavilion);

router.put("/updatePavilion/:id", authenticate, updatePavilion);

router.post("/addPavilionReview/:country", authenticate, addPavilionsReviews);

router.get("/getAllPavilionReview/:country", getPavilionReviews);

router.post("/addFacility", authenticate, addFacility);

router.get("/getAllFacilities", getAllFacilities);

router.delete("/deleteFacility/:id", authenticate, deleteFacility);

router.put("/updateFacility/:id", authenticate, updateFacility);

router.post("/addShowTime", authenticate, addShowTime);

router.delete("/deleteShowTime/:id", authenticate, deleteShowTime);

router.put("/updateShowTime/:id", authenticate, updateShowTime);

router.get("/getAllShowTimes", getAllShowTimes);

router.post("/bookTickets", authenticate, bookTickets);

router.get("/getTicketUser", authenticate, getTicketUser);

router.delete("/deleteTicket/:id", authenticate, deleteTicket);

router.get("/getAllTickets", authenticate, getAllTickets);

router.post("/checkout-session/:ticketId", authenticate, payment);

router.post("/payDone/:ticketId", authenticate, payDone);

module.exports = router;
