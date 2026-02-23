import express from "express";
import routes from "./modules/routes";
import swaggerRoutes from "./swagger";
import cors from "cors";

const app = express();
app.disable('etag');
const port = process.env.PORT || 3001;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8081",
  "http://localhost:8080",
  "https://restaurant.maison.run.place",
  "http://212.115.110.115:8080", //Swagger server
  "http://tauri.localhost",
  "https://restaurant.maison.run.place."
];

app.use(
  cors({
    origin: (origin, callback) => {
    //  console.log("Incoming Request Origin:", origin); // Add this line
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS Blocked: ${origin} is not in allowedOrigins`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());


app.use("/api-docs", swaggerRoutes);

app.use("/api", routes);

app.use("/health", (req, res) => {
  res.status(200).send("OK Server is healthy v21");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
