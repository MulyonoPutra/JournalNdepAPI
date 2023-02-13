import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import cookieParser from 'cookie-parser';
import { DBConnection } from './config/db-connection';
import { Environment } from './config/environment';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app: Express = express();
const port: string = process.env.PORT ?? '3000';

cloudinary.config({
	cloud_name: Environment.cloudinaryName,
	api_key: Environment.cloudinaryApiKey,
	api_secret: Environment.cloudinaryApiSecret,
	secure: true,
});

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(routes);

app.use((err: any, req: Request, res: Response) => {
	err.status = err.status || 'error';
	err.statusCode = err.statusCode || 500;

	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
	});
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
	DBConnection();
});
