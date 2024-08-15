import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import homeRoutes from './routes/homeRoutes';
import aboutRoutes from './routes/aboutRoutes';
import contactRoutes from './routes/contactRoutes';
import errorHandler from './middleware/errorHandler';
import connectDB from './config/db';

dotenv.config();
connectDB();

const PORT = process.env.PORT;

const app = express();

app.use(bodyParser.json());

app.use('/', homeRoutes);
app.use('/about', aboutRoutes);
app.use('/contact', contactRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
