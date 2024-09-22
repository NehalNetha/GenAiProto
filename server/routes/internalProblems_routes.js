import { Router } from "express";
import { addProblem, getProblem, getProblemById } from "../controllers/problem_controller.js";


const internalRouter = Router()

internalRouter.get("/internal/problems", getProblem)
internalRouter.get("/internal/problems/:id", getProblemById)

internalRouter.post("/internal/problems", addProblem)


export default internalRouter