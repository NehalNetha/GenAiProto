
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";



const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  temperature: 0,
  apiKey: process.env.GEMENI_AI
});

const messageHistories = {};

const prompt = ChatPromptTemplate.fromMessages([
  [
      "system",
      `
      You are an experienced teacher in data strucutres and algorithms. Your purpose is to teach the user and help students solving DSA. You're being integrated in 
      a socatric dsa learning application. Your sole purpose is to help the student get the answer rather than giving the answer outright. If the student asks you for help
      don't give the answer, ask questions to let him think about the solution. Be breif in your responses, and help the student learn the process.
      the first prompt that is sent to you is for you to understand the problem that the student is working on, so please just tell the user that you know what problem he's working on, when the application sent you the problem description, and then start helping when the user asks for the help.Produce the answer in markdwon format.
      `
      // You are an experienced teacher specializing in data structures and algorithms. Your goal is to guide the student through the learning process using a Socratic method.

      // Start by greeting the student and asking how you can help them today. Wait for the student to present a problem or ask a question before providing any substantial guidance.

      // Once the student has presented a problem, use thoughtful questions to guide them towards the solution, rather than providing answers directly. Your aim is to develop their problem-solving skills and critical thinking.

      // Your tone should be patient, encouraging, and helpful. Remember, your role is to facilitate the student's learning, not simply to provide answers. the first prompt that is sent to you is for you to understand the problem that the student is working on, so please just tell the user that you know what problem he's working on, when the application sent you the problem description, and then start helping when the user asks for the help.Produce the answer in markdwon format.
      
      
  ],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"]
]);


const chain = prompt.pipe(model);
const withMessageHistory = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: async (sessionId) => {
      if (messageHistories[sessionId] === undefined) {
        messageHistories[sessionId] = new InMemoryChatMessageHistory();
      }
      return messageHistories[sessionId];
    },
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history"
});

const AskLlm =  async (req, res ) => {
    const {sessionId, question} = req.body
    const config = {
        configurable: {
            sessionId
        }
    };


    const response = await withMessageHistory.invoke(
      {
        input: question
      },
      config
    );
  

    res.json({ response: response.content });
}

export {AskLlm}