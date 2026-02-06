export const handleImageUrl = (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).send({ msg: "Missing URL for API Call" });
    }
    const PAT = "445fda128afe40798280415405dcbef1";
    const USER_ID = "em-lopez-dev";
    const APP_ID = "smart-brain";
    const MODEL_ID = "face-detection";
    const MODEL_VERSION_ID = "45fb9a671625463fa646c3523a3087d5";

    const raw = JSON.stringify({
        user_app_id: {
            user_id: USER_ID,
            app_id: APP_ID,
        },
        inputs: [
            {
                data: {
                    image: {
                        url: url,
                    },
                },
            },
        ],
    });

    const requestOptions = {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: "Key " + PAT,
        },
        body: raw,
    };

    fetch(
        `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
        requestOptions,
    )
        .then((response) => response.json())
        .then((data) => res.send(data))
        .catch(() =>
            res.status(400).send({ msg: "Unable to make External API Call" }),
        );
};

export const handleImageEntry = (req, res, db) => {
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
