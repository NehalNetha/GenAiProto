import express, { request } from "express"
import { VM } from "vm2";
import cors from 'cors';


import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMistralAI } from "@langchain/mistralai";
import router from "./routes/problem_routes.js";
import testProblemRouter from "./routes/testProblem_routes.js";
import llmRouter from "./routes/llm_routes.js";
import connectDB from "./database/database.js";
import internalRouter from "./routes/internalProblems_routes.js";


const app = express()
const port = 8080; // or any port you prefer
const hostname = 'localhost';

app.use(express.json());


const corsOptions = {
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
  };


app.use(cors(corsOptions));
connectDB();

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.use("/", router)
app.use("/", testProblemRouter)
app.use("/", llmRouter)
app.use("/", internalRouter)






  
app.listen(port, hostname, function () {
console.log(`Server running at http://${hostname}:${port}/`);
});