import 'express-async-errors';

import express from 'express';


const app = express();

import morgan from 'morgan';
import mongoose from 'mongoose';
// middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import  {authenticateUser}  from './middleware/authMiddleware.js';
// AuthRouter
import authRouter from './routes/authRouter.js'
//user Router
import userRouter from './routes/userRouter.js'

//Verify cookie

import cookieParser from 'cookie-parser';


// router
import jobRouter from  './routes/jobRouter.js';
import * as dotenv from 'dotenv';
import { nanoid } from 'nanoid';


dotenv.config();

if (process.env.NODE_ENV === 'development')
    {
        app.use(morgan('dev'));
    }

  
app.use(cookieParser())
app.use(express.json());

// let jobs = [
//   { id: nanoid(), company: 'apple', position: 'front-end' },
//   { id: nanoid(), company: 'google', position: 'back-end' },
// ];

// app.get('/', (req, res) => {
//   res.send('Hello World');
// });



app.post('/',(req,res) => {
    console.log(res);
    res.json({message:'data received' , data:req.body})
})

// Get All Job
app.get('/api/v1/jobs')

// create Job

app.post('/api/v1/jobs')

// GET SINGLE JOB

app.get('/api/v1/jobs/:id')

// EDIT JOB

app.patch('/api/v1/jobs/:id')

// DELETE JOB

app.delete('/api/v1/jobs/:id')

// app.listen(5100, () => {
//   console.log('server running....');
// });


app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
// Use the authRouter for authentication routes


app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, 
      useUnifiedTopology: true ,
      serverSelectionTimeoutMS: 30000 
    });
  app.listen(port, () => {
    console.log(`Server running on PORT ${port}....`);
  });
} catch (error) {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
}

