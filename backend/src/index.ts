import express, { Request, Response } from 'express';
import cors from 'cors';

type Message = {
	id: number;
	username: string;
	text: string;
	timestamp: string;
};

const server = express();
const PORT = 4000;

const messages: Message[] = [];

function* infiniteSequence() {
	let i = 0;
	while (true) {
		yield ++i;
	}
}

const idIterator = infiniteSequence();

server.use(cors());
server.use(express.json());

server.get('/', function (req: Request, res: Response) {
	res.status(200).json('Hello from backend');
});

server.get('/messages', function (req: Request, res: Response) {
	res.status(200).json([...messages]);
});

server.post('/messages', function (req: Request, res: Response) {
	const { username, text } = req.body;

	if (typeof username !== 'string') {
		res.status(400).send({
			message: 'Incorrect username value. It must be string',
		});

		return;
	}

	if (username.length < 2) {
		res.status(400).send({
			message: 'Incorrect username length. It must be over than 2 symbols',
		});

		return;
	}

	if (username.length > 50) {
		res.status(400).send({
			message: 'Incorrect username length. It must be less than 50 symbols',
		});

		return;
	}

	if (typeof text !== 'string' || text.length < 1 || text.length > 500) {
		res.status(400).send({
			message: 'Incorrect message text',
		});

		return;
	}

	if (typeof text !== 'string') {
		res.status(400).send({
			message: 'Incorrect text-message value. It must be string',
		});

		return;
	}

	if (text.length < 1) {
		res.status(400).send({
			message: 'Incorrect text-message length. It must be over than 1 symbol',
		});

		return;
	}

	if (text.length > 500) {
		res.status(400).send({
			message: 'Incorrect text-message length. It must be less than 500 symbol',
		});

		return;
	}

	const newMessage = {
		id: idIterator.next().value as number,
		text,
		timestamp: new Date().toISOString(),
		username,
	};

	messages.push(newMessage);
	res.status(201).send(newMessage);
});

server.listen(PORT, function () {
	console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
