import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './routes';
import { Morgan } from './shared/morgen';
import { handleStripeWebhook } from './webhook/handleStripeWebhook';
import multer from 'multer';
import auth from './app/middlewares/auth';
import { handleChunkUpload } from './helpers/handleChunckUpload';
const app = express();
const upload = multer({ dest: 'uploads/' });
//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

// webhook
app.post("/api/webhook",express.raw({ type: 'application/json' }), handleStripeWebhook);

//body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static('assets'))
app.use(express.static('uploads'));

//router
app.use('/api/v1', router);
app.post("/api/v1/upload",upload.single("chunk"),handleChunkUpload)

//live response
app.get('/', (req: Request, res: Response) => {
  const date = new Date(Date.now());
  res.send(
    `<h1 style="text-align:center; color:#173616; font-family:Verdana;">Beep-beep! The server is alive and kicking.</h1>
    <p style="text-align:center; color:#173616; font-family:Verdana;">${date}</p>
    `
  );
});

//global error handle
app.use(globalErrorHandler);

//handle not found route;
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
});

export default app;
