import express, { Request, Response } from "express";

type Message = {
  "id": number,
  "username": string,
  "text": string,
  "timestamp": string,
};

const server = express();
const PORT = 4000;

const messages:Message[] = [];

server.get("/", function(req: Request, res: Response) {
  res.status(200).json("Hello from backend");
});

server.get("/messages", function(req: Request, res: Response) {
  res.status(200).json([...messages, {
    "id": messages.length,
    "username": "Bot 🤖",
    "text": "Welcome to chat",
    "timestamp": new Date().toISOString(),
  }]);
});

server.listen(PORT, function() {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
