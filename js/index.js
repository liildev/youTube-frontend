let iframesList = document.querySelector(".iframes-list");
let avatarImg = document.querySelector(".avatar-img");
let navbarList = document.querySelector(".navbar-list");
let searchBox = document.querySelector(".search-input");
let home = document.getElementById('home')
let microphone = document.getElementById('microphone')
const API = "http://localhost:5005/";

let avatar = JSON.parse(window.localStorage.getItem("userInfo"));
avatarImg.src = API + avatar.avatar;

navbarList.addEventListener('onclick', (event) => {
  let target = event.target.elements;
  console.log(target);

})

home.onclick = () => {
  fetchVideos();
  home.classList.add('active')
  // elLi.classList.remove('active')
}


async function fetchVideos() {
  try {
    let res = await fetch(API + "videos");
    let data = await res.json();
    renderVideos(data);
  } catch (error) {
    throw Error(`error:${error}`);
  }
}

fetchVideos()

function renderVideos(data) {
  iframesList.innerHTML = null

  data.map((videos) => {
    let date = new Date(videos.date);
    date = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    var sizeInMB = (videos.size / (1024 * 1024)).toFixed(2) + " MB";

    let li = document.createElement("li");
    li.className = "iframe";

    let object = document.createElement("object");
    object.data = API + videos.link;

    let div = document.createElement("div");
    div.className = "iframe-footer";

    let img = document.createElement("img");
    img.src = API + videos.user.avatar;

    let div2 = document.createElement("div");
    div2.className = "iframe-footer-text";

    let div3 = document.createElement("div");
    div3.className = "iframe-footer-text";


    let h2 = document.createElement("h2");
    h2.className = "channel-name";
    h2.textContent = videos.title;

    let h3 = document.createElement("h3");
    h3.className = "iframe-title";
    h3.textContent = videos.user.username;

    let time = document.createElement("time");
    time.className = "uploaded-time";
    time.textContent = date;

    let a = document.createElement("a");
    a.href = API + videos.download;
    a.className = "download";

    let span = document.createElement("span");
    span.textContent = sizeInMB;

    let img2 = document.createElement("img");
    img2.dataset.download = "download";
    img2.src = "./img/download.png";

    a.append(span, img2);
    div2.append(h2, h3, time, a);
    div.append(img, div2);
    li.append(object, div);
    iframesList.append(li);
  });
}

async function renderUsers() {
  let res = await fetch(API + 'users');
  let data = await res.json();

  data.map((user) => {
    let userId = user.userId;
    let li = document.createElement("li");
    li.dataset.id = "1";
    li.className = "channel";

    let a = document.createElement("a");
    a.href = "#";
    a.onclick = async () => {
      li.classList.add('active')
      home.classList.remove('active')

      let res = await fetch(API + `videos?userId=${userId}`);
      let video = await res.json();
      renderVideos(video);
    };

    let img = document.createElement("img");
    img.src = API + user.avatar;
    img.width = 30;
    img.height = 30;

    let span = document.createElement("span");
    span.textContent = user.username;

    a.append(img, span);
    li.append(a);
    navbarList.append(li);
  });
}

renderUsers();


// SEARCH
async function getData(search) {
  try {
    let res = await fetch(API + `videos?search=${search}`);

    let data = await res.json();
    renderVideos(data);

  } catch(error) {
    throw Error(`error:${error}`);
  }
}


searchBox.addEventListener('keyup', (event) => {
  let searchTerm = event.target.value;
  getData(searchTerm);
})



function getLocalStream() {
  navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
      window.localStream = stream; // A
      // window.localAudio.srcObject = stream; // B
      // window.localAudio.autoplay = true; // C
  }).catch( err => {
      console.log("u got an error:" + err)
  });
}

// getLocalStream()


microphone.onclick = () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    const audioChunks = [];
    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
      console.log(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    });

    setTimeout(() => {
      mediaRecorder.stop();
    }, 3000);
  });
}


