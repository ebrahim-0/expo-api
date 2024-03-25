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

const router = express.Router();

router.post("/sendMessage", sendMessage);

router.get("/getAllUsers", getAllUsers);

router.get("/getUserById/:id", getUserById);

router.delete("/deleteUser/:id", deleteUser);

router.put("/updateUser/:id", updateUser);

router.post("/addPavilion", authenticate, addPavilion);

router.get("/getAllPavilions", authenticate, getAllPavilions);

router.get(
  "/getPavilionByCountry/:country",
  authenticate,
  getPavilionByCountry
);

router.delete("/deletePavilion/:id", authenticate, deletePavilion);

router.put("/updatePavilion/:id", authenticate, updatePavilion);

router.post("/addPavilionReview/:country", authenticate, addPavilionsReviews);

router.get("/getAllPavilionReview/:country", authenticate, getPavilionReviews);

router.post("/addFacility", authenticate, addFacility);

router.get("/getAllFacilities", authenticate, getAllFacilities);

router.delete("/deleteFacility/:id", authenticate, deleteFacility);

router.put("/updateFacility/:id", authenticate, updateFacility);

router.post("/addShowTime", authenticate, addShowTime);

router.delete("/deleteShowTime/:id", authenticate, deleteShowTime);

router.put("/updateShowTime/:id", authenticate, updateShowTime);

router.get("/getAllShowTimes", authenticate, getAllShowTimes);

module.exports = router;
