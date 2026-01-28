import express from 'express';
import routes from './modules/routes';
import swaggerRoutes from './swagger';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8080",
  "https://yourdomain.com",
  "http://212.115.110.115:8080",  //Swagger server
];


app.use(express.json());


app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / curl / Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use('/api-docs', swaggerRoutes);
app.use('/api', routes);

app.use('/health', (req, res) => {
  res.status(200).send('OK Server is healthy v4');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
