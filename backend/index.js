import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/UserRoutes.js';
import connectDB from './db.js';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

dotenv.config();

await connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(userRouter);

// Load and serve the OpenAPI YAML file
const swaggerDocument = YAML.load('./docs/openapi.yml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
    console.log(`Swagger docs available at http://localhost:${process.env.PORT}/api-docs`);
})
