// import { OpenRouter } from '@openrouter/sdk';
// import dotenv from 'dotenv';

// dotenv.config(); 

// const openRouter = new OpenRouter({
//   apiKey: process.env.OPENROUTER_API_KEY,
// });

// const response = await openRouter.chat.send({
//   chatRequest: {   
//     model: 'nvidia/nemotron-3-super-120b-a12b:free',
//     messages: [
//       {
//         role: 'user',
//         content: 'Give me a joke',
//       },
//     ],
//     stream: false,
//   }
// });

// console.log(response.choices[0].message.content);
import express from 'express';
import cors from 'cors';  
import dotenv from 'dotenv'; 
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';
dotenv.config(); 

const app = express();
const port=8080;

app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to Database!');
    } catch (err) {
         console.log("Failed to connect to Database:", err);
    }
app.get("/test", (req, res) => {
    res.json({ message: "Server is running" });
});
}

// app.post('/test', async (req, res) => {
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
//         },
//         body: JSON.stringify({ 
//             model: 'nvidia/nemotron-3-super-120b-a12b:free',
//             messages: [
//                 {   "role": "user",
//         "content": req.body.message || "Hello"
//       }
//     ],
//         })
//     };
// try {
// let response = await fetch("https://openrouter.ai/api/v1/chat/completions",options);
// const data = await response.json();
// // console.log(data.choices[0].message.content);
// res.send({response: data.choices[0].message.content});
// }catch (err) {
//     console.log(err);
// }
// });
