import express from "express";
import asyncHandler from "../async-handler.js";
import multer from "multer";
import path from "path";
import { fileTypeFromFime } from "file-type";
import fs from "fs";

const __dirname = path.resolve();

const uploadRouter = express.Router();

const upload = multer({
  dest: "files/",
  limits: { fieldNameSize: 100, fileSize: 2048 * 2048 },
});

uploadRouter
  .route("/")
  .get(
    asyncHandler(async (_, res) => {
      res.sendFile(__dirname + "/webpage/upload.html");
    })
  )
  .post(
    upload.single("attachment"),
    asyncHandler(async (req, res) => {
      const filePath = `/files/${req.file.filename}`;
      const ext = await fileTypeFromFime(filePath);
      console.log(ext);
      if (ext === undefined) {
        fs.unlink(filePath, (err) => {
          if (err) console.log("unlink err", err);
        });
        const e = new Error("");
        e.name = "FileExtensionError";
        throw e;
      }
      const downloadPath = `/download/${req.file.filename}`;
      res.json({ downloadPath });
    })
  );

export default uploadRouter;
