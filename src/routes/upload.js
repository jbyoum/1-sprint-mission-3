import express from "express";
import asyncHandler from "../async-handler.js";
import multer from "multer";
import path from "path";
import { fileTypeFromFile } from "file-type";
import fs from "fs";

const __dirname = path.resolve();

const uploadRouter = express.Router();

const allowedExt = [
  "jpg",
  "j2c",
  "jp2",
  "jpm",
  "jpx",
  "png",
  "webp",
  "avif",
  "bmp",
  "gif",
  "icns",
  "ico",
];

const upload = multer({
  dest: "files/",
  limits: { fieldNameSize: 100, fileSize: 2048 * 2048 },
});

uploadRouter.route("/deleteAll").get(
  asyncHandler(async (_, res) => {
    const dir = __dirname + "/files/";
    fs.readdirSync(dir).forEach((file) => fs.rmSync(`${dir}/${file}`));
    res.send("deleting sync");
  })
);

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
      const filePath = `${__dirname}/files/${req.file.filename}`;
      const ext = await fileTypeFromFile(filePath);
      console.log(ext);
      if (!ext in allowedExt) {
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
