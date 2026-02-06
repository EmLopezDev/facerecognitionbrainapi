const handleImage = (req, res, db) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send({ msg: "Missing User ID" });
    }
    db("users")
        .where("id", "=", id)
        .increment("entries", 1)
        .returning("entries")
        .then((entries) => res.send(entries[0].entries))
        .catch(() => res.status(400).send({ msg: "Unable to update entries" }));
};

export default handleImage;
