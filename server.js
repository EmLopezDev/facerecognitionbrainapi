import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import knex from "knex";

const PORT = 3000;

const app = express();

const config = {
    client: "pg",
    connection: {
        host: "127.0.0.1",
        port: "5432",
        user: "postgres",
        password: "",
        database: "smart-brain",
    },
};

const db = knex(config);

const database = {
    users: [
        {
            id: 1,
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date(),
        },
        {
            id: 2,
            name: "Sally",
            email: "sally@gmail.com",
            password: "banana",
            entries: 0,
            joined: new Date(),
        },
    ],
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send(database.users);
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    const [foundUser] = database.users.filter((user) => user.id === Number(id));
    if (!foundUser) {
        res.status(404).send("User not found");
    }
    res.send(foundUser);
});

app.post("/signin", (req, res) => {
    if (
        req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password
    ) {
        delete database.users[0].password;
        res.send(database.users[0]);
    }
    res.status(404).send("Error login in");
});

app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        console.log(hash);
    });
    db("users")
        .returning("*")
        .insert({ name, email, joined: new Date() })
        .then((user) => res.send(user[0]))
        .catch(() => res.status(400).send("Unable to register"));
});

app.put("/image", (req, res) => {
    const { id } = req.body;
    const [foundUser] = database.users.filter((user) => user.id === Number(id));
    if (!foundUser) {
        res.status(404).send("User not found");
    }
    foundUser.entries += 1;
    res.send(foundUser.entries);
});

app.listen(PORT, () => {
    console.log(`App is running on PORT: ${PORT}`);
});
