const express = require("express");
const cors = require("cors");
const monk = require("monk");
const Filter = require("bad-words");
const rateLimit = require("express-rate-limit");

const app = express();

const db = monk("localhost/twitter");
const tweets = db.get(process.env.MONGO_URI || "tweets");
filter = new Filter();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "route / working..",
  });
});

app.get("/tweets", (req, res) => {
  tweets.find().then((tweets) => {
    res.json(tweets);
  });
});

function isValidTweet(tweet) {
  return (
    tweet.name &&
    tweet.name.toString().trim() !== "" &&
    tweet.content &&
    tweet.content.toString().trim() !== ""
  );
}

app.use(
  rateLimit({
    windowMs: 10 * 1000, //10sec
    max: 3,
  })
);

app.post("/tweets", (req, res) => {
  if (isValidTweet(req.body)) {
    const tweet = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
      created: new Date(),
    };
    tweets.insert(tweet).then((createdTweet) => {
      res.json(createdTweet);
    });
  } else {
    res.status(422);
    res.json({
      message: "Name and Content are required",
    });
  }
});

app.put("/tweet/:id", (req, res) => {
  const id = req.params.id;
  const tweet = {
    content: filter.clean(req.body.comment.toString()),
  };
  tweets.findOneAndUpdate(id, { $set: tweet }).then((updatedTweet) => {
    res.json(updatedTweet);
  });
});

app.delete("/removeTweet/:id", (req, res) => {
  const id = req.params.id;
  tweets
    .remove({
      _id: id,
    })
    .then((deletedTweet) => {
      res.json(deletedTweet);
      res.status(204);
    });
});

app.listen(5000, () => {
  console.log("listening");
});
