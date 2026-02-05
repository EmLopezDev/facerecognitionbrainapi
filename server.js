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

const bCryptSaltRounds = 10;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Success");
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    db.select("*")
        .from("users")
        .where({ id })
        .then((user) => {
            if (user.length) {
                res.send(user[0]);
            } else {
                res.status(400).send({ msg: "User not found" });
            }
        })
        .catch(() => res.status(400).send({ msg: "Error getting user" }));
});

app.post("/signin", (req, res) => {
    const { email, password } = req.body;
    db.select("email", "hash")
        .from("login")
        .where("email", "=", email)
        .then((data) => {
            bcrypt.compare(password, data[0].hash, (err, result) => {
                if (result) {
                    db.select("*")
                        .from("users")
                        .where("email", "=", email)
                        .then((user) => {
                            res.send(user[0]);
                        })
                        .catch((err) =>
                            res
                                .status(400)
                                .send({ msg: "Unable to get user" }, err),
                        );
                } else {
                    res.status(400).send({ msg: "Wrong Credentials" }, err);
                }
            });
        })
        .catch((err) =>
            res.status(400).send({ msg: "User doesn't exist" }, err),
        );
});

app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, bCryptSaltRounds, (err, hash) => {
        if (hash) {
            db.transaction((trx) => {
                trx.insert({
                    hash: hash,
                    email: email,
                })
                    .into("login")
                    .returning("email")
                    .then((loginEmail) => {
                        trx.insert({
                            name: name,
                            email: loginEmail[0].email,
                            joined: new Date(),
                        })
                            .into("users")
                            .then(() => res.status(200).send([]));
                    })
                    .then(trx.commit)
                    .catch(trx.rollback);
            }).catch(() => res.status(400).send({ msg: "Unable to register" }));
        } else {
            console.error({ msg: "Error while registering" }, err);
        }
    });
});

app.put("/image", (req, res) => {
    const { id } = req.body;
    db("users")
        .where("id", "=", id)
        .increment("entries", 1)
        .returning("entries")
        .then((entries) => res.send(entries[0].entries))
        .catch(() => res.status(400).send({ msg: "Unable to update entries" }));
});

app.listen(PORT, () => {
    console.log(`App is running on PORT: ${PORT}`);
});
