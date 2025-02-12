import express from "express";
import { borrowRoutes } from "./borrow-routes";
const app = express();

app.use("/borrow", borrowRoutes);

export const baseRoutes = app;