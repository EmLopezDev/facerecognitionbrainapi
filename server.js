import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import knex from "knex";
import handleRegister from "./controllers/register.js";
import handleSignIn from "./controllers/signin.js";
import { handleImageEntry, handleImageUrl } from "./controllers/image.js";
import handleProfile from "./controllers/profile.js";

const PORT = process.env.PORT || 3000;

const app = express();

const config = {
    client: "pg",
    connection: {
        host: process.env.DATABASE_HOST,
        port: "5432",
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PW,
        database: process.env.DATABASE_DB,
    },
};

const db = knex(config);

const bCryptSaltRounds = 10;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// TODO: Route is not being used yet, leaving it to expand on soon
app.get("/profile/:id", (req, res) => handleProfile(req, res, db));

app.post("/signin", (req, res) => handleSignIn(req, res, db, bcrypt));

app.post("/register", (req, res) =>
    handleRegister(req, res, db, bcrypt, bCryptSaltRounds),
);

app.put("/image", (req, res) => handleImageEntry(req, res, db));
app.post("/imageurl", (req, res) => handleImageUrl(req, res));

app.listen(PORT, () => {
    console.log(`App is running on PORT: ${PORT}`);
});
