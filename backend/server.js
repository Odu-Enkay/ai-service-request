const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//===== Import Routes =====//
const requestsRouter = require('./routes/requests');


//===== Middleware =====//
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
//===== Routes =====//
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello! the backend is working!' });
});

//==== Use the requests router for all /api/requests routes ====//
app.use('/api/requests', requestsRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


