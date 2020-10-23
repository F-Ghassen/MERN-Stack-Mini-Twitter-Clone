const form = document.querySelector("form");
const loadingElement = document.querySelector(".loading");
const API_URL = "http://localhost:5000/tweets";
const TweetsElement = document.querySelector(".tweets");
loadingElement.style.display = "none";

listAllTweets();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("name");
  const content = formData.get("content");

  const tweet = {
    name,
    content,
  };
  //console.log(tweet);
  form.style.display = "none";
  loadingElement.style.display = "";

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(tweet),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((createdTweet) => {
      form.reset();
      setTimeout(() => {
        form.style.display = "";
      }, 500);
      listAllTweets();
    });
});

function listAllTweets() {
  TweetsElement.innerHTML = "";
  fetch(API_URL)
    .then((response) => response.json())
    .then((tweets) => {
      //console.log(tweets);
      tweets.reverse();
      tweets.forEach((tweet) => {
        const div = document.createElement("div");

        const header = document.createElement("h4");
        header.textContent = tweet.name;

        const img = new Image();
        img.src = "https://cameroon.nmbrpro.com/assets/img_avatar.png";

        const contents = document.createElement("p");
        contents.textContent = tweet.content;
        contents.contentEditable = "true";
        contents.addEventListener("blur", function () {
          makeInput(contents, tweet._id);
        });

        const date = document.createElement("small");
        date.textContent = tweet.created;

        const btn_delete = document.createElement("span");
        btn_delete.innerHTML =
          "<i onclick=\"removeTweet('" +
          tweet._id +
          '\')" class="far fa-trash-alt"></i>';

        const btn_update = document.createElement("span");
        btn_update.innerHTML = "<i class='fas fa-edit'></i>";

        div.appendChild(img);
        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);
        div.appendChild(btn_delete);
        //div.appendChild(btn_update);

        TweetsElement.appendChild(div);
      });
      loadingElement.style.display = "none";
    });
}

function makeInput(e, id) {
  const newComment = e.innerHTML;
  const body = { comment: newComment };
  const API_URL_Update = "http://localhost:5000/tweet/" + id;
  fetch(API_URL_Update, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json()); // expecting a json response
}

function removeTweet(id) {
  const API_URL_Remove = "http://localhost:5000/removeTweet/" + id;
  fetch(API_URL_Remove, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  }).then(location.reload());
}
