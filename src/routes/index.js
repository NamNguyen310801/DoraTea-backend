const user = require("./user");
const product = require("./product");
const category = require("./category");
const image = require("./image");
const cart = require("./cart");
const order = require("./order");
const email = require("./email");
const routes = (app) => {
  app.use("/api/user", user);
  app.use("/api/product", product);
  app.use("/api/category", category);
  app.use("/api/image", image);
  app.use("/api/cart", cart);
  app.use("/api/order", order);
  app.use("/api/email", email);
};
module.exports = routes;
