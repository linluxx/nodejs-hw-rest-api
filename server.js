const dotenv = require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

const { HOST_URI } = process.env;

mongoose.set("strictQuery", false);

(async function main() {
  try {
    await mongoose.connect(HOST_URI);
    console.log("Database connection successful");

    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
