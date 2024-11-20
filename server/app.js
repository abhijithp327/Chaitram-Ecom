import express from 'express'
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import connectDb from './src/config/dbConfig.js';
import morgan from 'morgan';
import helmet from 'helmet';

// Routes import
import userRoute from './src/routes/userRoute.js'


const app = express();
dotenv.config();

const port = process.env.PORT || 5001

const corsOptions = {
    origin: 'http://localhost:5173',
    // origin: 'http://192.168.10.194:5173',
    credentials: true
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
    crossOrginResourcePolicy: false
}));

app.get('/', (req, res) => {
    res.json('🔴 Chaitram API is running... ✅');
});

// Routes
app.use('/api/v1/user', userRoute);

connectDb().then(() => {
    app.listen(port, () => {
        console.log('✅ Database connected successfully');
        console.log(`🔴 Server is running http://localhost:${port}`);
    });
});