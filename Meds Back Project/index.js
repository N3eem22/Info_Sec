// ============================= INITIALIZE  EXPRESS =======================

const express = require("express");
const app = express();
require('dotenv').config();

// ============================= Global MIDDLEWARE  =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //To Access url form encoded
app.use(express.static("upload"));
app.use(require("cookie-parser")());
const cors = require("cors");
app.use(cors()); // allow HTTP request local host
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,  // Secret key to sign the session ID cookie
  resave: false,              // Avoids resaving unchanged sessions
  saveUninitialized: true,   // Avoids creating new sessions until they are modified
  cookie: { maxAge: 6000000 } // 2 hours session expiration
}));

// ====================  Required Module ====================
const auth = require("./routes/Auth");
const medicines = require("./routes/medicines");
const category = require("./routes/category");
const Requests = require("./routes/Requests");
const search = require("./routes/search");
const patient = require("./routes/patient");

// ====================  RUN THE APP  ====================
const PORT = process.env.PORT
app.listen(PORT, "localhost", () => {
  console.log(`SERVER IS RUNNING on port ${PORT}`);
});

// ====================  API ROUTES [ ENDPOINTS ]  ====================
app.use("/auth", auth);
app.use("/medicines", medicines);
app.use("/category", category);
app.use("/Requests", Requests);
app.use("/search", search);
app.use("/patient", patient);

