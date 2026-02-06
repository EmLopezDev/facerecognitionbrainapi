const handleProfile = (req, res, db) => {
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
};

export default handleProfile;
