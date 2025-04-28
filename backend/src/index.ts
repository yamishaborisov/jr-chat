import express, { Request, Response } from "express";

const server = express();
const PORT = 4000;

server.get("/", function(req: Request, res: Response) {
  res.status(200).json("Hello from backend");
});

server.listen(PORT, function() {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
