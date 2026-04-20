import express from "express";
import userservices from "./userServices";

const userRouter = express.Router();

userRouter.post("/create", async (req, res) => {
  const { success, data, error } = userservices.createUser(req.body);
  console.log(req.body);
  if (success) {
    return res.status(200).json(data);
  }
  return res.status(500).json(error);
});

userRouter.get("/get/:id", async (req, res) => {
  const { success, data, error } = userservices.getUserById(req.params.id);
  if (success) {
    return res.status(200).json(data);
  }
  return res.status(500).json(error);
});

userRouter.put("/update/:id", async (req, res) => {
  const { success, data, error } = userservices.updateUser(
    req.params.id,
    req.body,
  );
  if (success) {
    return res.status(200).json(data);
  }
  return res.status(500).json(error);
});

userRouter.delete("/delete/:id", async (req, res) => {
  const { success, data, error } = userservices.deleteUser(req.params.id);
  if (success) {
    return res.status(200).json(data);
  }
  return res.status(500).json(error);
});

export default userRouter;
