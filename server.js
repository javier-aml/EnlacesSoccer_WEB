const express = require('express');
const TestRoutes = require('./app/routes/test.routes');
const app = express();
const PORT = process.env.PORT || 8080;

app.use('/', TestRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
