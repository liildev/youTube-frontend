let elForm = document.getElementById("registerForm");

const API = "http://localhost:5005/";

elForm.onsubmit = async (evt) => {
  evt.preventDefault();

  let { user_input, password_input, upload } = evt.target.elements;

  let fileData = new FormData();

  fileData.append("file", upload.files[0]);
  fileData.append("username", user_input.value);
  fileData.append("password", password_input.value);

  let res = await fetch(API + "register", {
    method: "POST",
    body: fileData,
  });

  let data = await res.json();

  if (!data) return;
  if (!data.token) window.location = "/register.html";

  window.localStorage.setItem("token", data.token);
  window.localStorage.setItem("userInfo", JSON.stringify(data.data));
  window.location.replace("index.html");
  alert(data.message);

  user_input.value = null;
  password_input.value = null;
};
