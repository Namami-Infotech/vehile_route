require("dotenv").config();
const app = require("./app");
const { sequelize, testConnection } = require("./core/config/database");

const PORT = process.env.PORT || 50005;

async function startServer() {
  console.log(
    `Starting vehicle backend on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`,
  );

  try {
    await testConnection();
    await sequelize.sync();
    console.log("Database schema synced successfully.");
  } catch (error) {
    console.warn(
      "Database connection could not be established. HTTP server will still start.",
    );
  }

  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
