import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router/index.js';
import { initDB } from './data-base/db.js';
import errorMiddleware from './middlewares/error-middleware.js';
import logginMiddleware from './middlewares/logging.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(logginMiddleware)
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use('/api', router);
app.use(errorMiddleware);

try {
    await initDB();
    app.listen(PORT, () => console.log(`Server started on Port = ${PORT}`));
} catch (e) {
    console.log(e);
}
