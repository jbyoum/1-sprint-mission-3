import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import multer from "multer";
import path from "path";
import articleRouter from "./routes/article.js";
import productRouter from "./routes/product.js";

dotenv.config();

const __dirname = path.resolve();

const app = express();
const upload = multer({ dest: "files/", limits: { fileSize: 2048 * 2048 } });
const corsOptions = {
  origin: [
    "http://127.0.0.1:3000",
    "https://one-sprint-mission-3.onrender.com",
  ],
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/download", express.static("files"));

app.use("/products", productRouter);

app.use("/articles", articleRouter);

//업로드 에러처리
app.get("/upload", (req, res) => {
  res.sendFile(__dirname + "/webpage/upload.html");
});

app.post("/upload", upload.single("attachment"), (req, res) => {
  const path = `/download/${req.file.filename}`;
  console.log(req.file);
  res.json({ path });
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
