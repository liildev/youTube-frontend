let elForm = document.getElementById("loginForm");

const API = "http://localhost:5005/";

const token = window.localStorage.getItem("token");

elForm.onsubmit = async (evt) => {
  evt.preventDefault();

  let { user_input, password_input } = evt.target.elements;

  let res = await fetch(API + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: user_input.value,
      password: password_input.value,
    }),
  });

  let data = await res.json()

  if (!data) return;
  window.localStorage.setItem("token", data.token);
  window.localStorage.setItem("userInfo", JSON.stringify(data.data));
  window.location.replace("index.html");
  alert(data.message);


  user_input.value = null;
  password_input.value = null;
};
