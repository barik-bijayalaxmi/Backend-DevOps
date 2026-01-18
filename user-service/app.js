const express = require("express");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Siva" },
    { id: 2, name: "DevOps User" }
  ]);
});

app.get("/health", (req, res) => {
  res.send("User Service is healthy");
});

app.listen(PORT, () =>
  console.log(`User Service running on port ${PORT}`)
);
