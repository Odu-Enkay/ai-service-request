const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
//const adminRouter = require('./routes/admin');

dotenv.config();

console.log('Loaded env vars:');
console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_PASS exists?', process.env.GMAIL_PASS ? 'Yes' : 'No');

const app = express();
const port = process.env.PORT || 3000;

//===== Import Routes =====//
const requestsRouter = require('./routes/requests');
const adminRouter = require('./routes/admin');


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
app.use('/api/admin', adminRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


