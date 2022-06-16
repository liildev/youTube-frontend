let videoForm = document.getElementById("videoForm");

let videosList = document.getElementById("videosList");
let logoutBtn = document.getElementById("logoutBtn");
const API = "http://localhost:5005/";
const token = window.localStorage.getItem("token");

videoForm.onsubmit = async (evt) => {
  evt.preventDefault();

  let { title, upload } = evt.target.elements;

  let videoData = new FormData();
  videoData.append("file", upload.files[0]);
  videoData.append("title", title.value);

  let res = await fetch(API + "videos", {
    method: "POST",
    headers: { token: token },
    body: videoData,
  });

  // renderVideos();
};


async function renderVideos() {
  let res = await fetch(API + "admin/videos", {
    method: "GET",
    headers: { token: token },
  });
  let data = await res.json();

  data.map((videos) => {
    let date = new Date(videos.date);
    date = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    let sizeInMB = (videos.size / (1024 * 1024)).toFixed(2) + " MB";

    let li = document.createElement("li");
    li.className = "video-item";

    let object = document.createElement("object");
    object.data = API + videos.link;

    let videoDiv = document.createElement("div");
    videoDiv.className = "video-footer";

    let img = document.createElement("img");
    img.src = API + videos.user.avatar;

    let footerDiv = document.createElement("div");
    footerDiv.className = "video-footer-text";

    let textDiv = document.createElement("div");
    textDiv.className = "iframe-footer-text";

    let userDiv = document.createElement("div");
    userDiv.className = "user";

    let sizeDiv = document.createElement("div");
    sizeDiv.className = "video-size";

    let downDiv = document.createElement("div");
    downDiv.className = "video-download";

    let h2 = document.createElement("h2");
    h2.className = "name";
    h2.textContent = videos.user.username;

    let h3 = document.createElement("h3");
    h3.className = "name";
    h3.textContent = videos.title;

    let contentdiv = document.createElement("div");
    contentdiv.contentEditable = true
    contentdiv.className = "title";

    let time = document.createElement("time");
    time.className = "time-uploaded";
    time.textContent = date;

    let a = document.createElement("a");
    a.href = API + videos.download;

    let span = document.createElement("span");
    span.textContent = sizeInMB;

    let img2 = document.createElement("img");
    img2.src = "./img/download.png";
    img2.className = "download-img";

    

    //dropdown
    let dropDown = document.createElement('div')
    dropDown.setAttribute('class', 'dropdown')

    
    let dataMore = document.createElement('img')
    dataMore.setAttribute('class', 'dropbtn')
    dataMore.src = "./img/dots.png"
    
    let dropdownContent = document.createElement('div')
    dropdownContent.setAttribute('class', 'dropdown-content')

    let edit = document.createElement('a')
    edit.textContent = 'EDIT'
    edit.onclick = async () => {
      console.log(h3.innerHTML);
      let res = await fetch(API + `admin/videos/${videos.videoId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          token: token 
        },
        body: JSON.stringify({title: h3.innerHTML}),
      });
    }


    let deleteEl = document.createElement('a')
    deleteEl.textContent = 'DELETE'
    deleteEl.onclick = async () => {
      let res = await fetch(API + `admin/videos/${videos.videoId}`, {
          method: "DELETE",
          headers: { token: token },
      });
    }


    //dropdown
    dropDown.appendChild(dataMore)
    dropDown.appendChild(dropdownContent)
    dropdownContent.appendChild(edit)
    dropdownContent.appendChild(deleteEl)

    a.append(img2);
    downDiv.append(span, a, dropDown);
    contentdiv.append(h3)
    userDiv.append(h2, contentdiv);
    sizeDiv.append(downDiv, time);
    textDiv.append(userDiv);
    footerDiv.append(textDiv, sizeDiv);
    videoDiv.append(img, footerDiv);
    li.append(object, videoDiv);
    videosList.append(li);
  });
}

renderVideos();

logoutBtn.onclick = () => {
  window.localStorage.removeItem("token");
  window.location.replace("/login.html");
};
