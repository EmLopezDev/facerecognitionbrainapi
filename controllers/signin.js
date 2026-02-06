const handleSignIn = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .send({ msg: "Incorrect Signin Form Submission" });
    }
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
};

export default handleSignIn;
