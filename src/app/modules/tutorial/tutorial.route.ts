import express from "express";
import { TutorialController } from "./tutorial.controller";
import multer from "multer";
import auth from "../../middlewares/auth";
import fileUploadHandler from "../../middlewares/fileUploadHandler";
const upload = multer({
  dest: 'uploads/chunks/', // Save each chunk here temporarily
});

const image = multer({
  dest: 'uploads/image/', // Save each chunk here temporarily
});
const router = express.Router();
router.post("/upload",upload.single("chunk"),TutorialController.uploadVideo);
router.get("/video/:url", TutorialController.getVideo);
router.route("/")
  .get(auth(),TutorialController.getAllTutorials)
router.route("/:id")
  .get(auth(),TutorialController.getTutorial)
  .patch(upload.single("chunk"),TutorialController.updateTurorial)
  .delete(auth(),TutorialController.deleteTutorial)
export const TutorialRoutes = router;