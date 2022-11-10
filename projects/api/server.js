const express = require("express");
require("dotenv").config();
const connectDB = require("./database/connectDB");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const app = express();
const PORT = process.env.PORT || 3000;

const startApp = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () =>
      console.log("Server is running on http://localhost:" + PORT)
    );
  } catch (err) {
    console.log(err);
  }
};

startApp();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
