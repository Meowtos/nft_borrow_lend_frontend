import express from "express";
import borrowController from "../controllers/borrow-controller";
const router = express.Router();

router.post("/list", borrowController.listNFT);
router.delete("/delist", borrowController.delistNFT);
router.put("/update-listing", borrowController.updateListing);
router.get("/get-listing/:user", borrowController.getListingByUser);
router.get("/get-listing", borrowController.getListing);

export const borrowRoutes = router;