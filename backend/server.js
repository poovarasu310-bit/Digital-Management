require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Api Routes
app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend working ✅');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
