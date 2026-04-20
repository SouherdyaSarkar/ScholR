import express from "express";
import cors from "cors";
import userRouter from "../../services/userServices/userRoutes.jsx";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from ScholR Node.js Server!");
});

app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Node Server is running on http://localhost:${PORT}`);
});
