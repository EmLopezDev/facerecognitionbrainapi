const handleRegister = (req, res, db, bcrypt, bCryptSaltRounds) => {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
        return res
            .status(400)
            .send({ msg: "Incorrect Register Form Submission" });
    }
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
};

export default handleRegister;
