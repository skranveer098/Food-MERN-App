const express = require('express');
const initializeDB = require('./db'); // Make sure the path is correct
const authRoutes = require('./Routes/Auth'); // Make sure the path is correct
const app = express();
const port = 5000;

// Middleware to handle CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});8

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize the database and start the server only after successful DB connection
initializeDB((err, foodData, foodCategory) => {
  if (err) {
    console.error("Failed to initialize database", err);
    process.exit(1); // Exit the process with a failure code
  } else {
    console.log("Database initialized with foodData and foodCategory");

    // Set the global variables after the data is fetched
    global.foodData = foodData;
    global.foodCategory = foodCategory;

    // Define your routes after the database has been initialized
    app.use('/api/auth', authRoutes);

    // Start the server only after the DB initialization
    app.listen(port, () => {
      console.log(`Example app listening on http://localhost:${port}`);
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});
