import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import publicRouter from '../../routes/publicRoutes.js';

const web = express();

web.use(cookieParser());
web.use(express.json());
web.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
web.use(cors({
  origin: 'http://localhost:3000'
}));
web.use(publicRouter);

export { web }