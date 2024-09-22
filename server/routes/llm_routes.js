import { Router } from "express";
import { AskLlm } from "../controllers/llm_controller.js";

const llmRouter = Router()

llmRouter.post("/ask-llm", AskLlm)

export default llmRouter