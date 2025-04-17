import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/UserRoutes.js';
import connectDB from './db.js';
import dotenv from 'dotenv';

dotenv.config();

await connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json(), userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})
