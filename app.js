const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const { sequelize } = require('./models');

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/api', dataRoutes);

sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

app.listen(3000, () => console.log('Server running on port 3000'));
