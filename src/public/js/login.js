import UserManager from "../dao/mongoManager/userManagerMongo.js";

/*==========================
-           LOGIN           -
===========================*/

const loginUser = async () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const user = { email, password };

  console.log(user);
  let busqueda = UserManager.login(email, password);

  if (busqueda) {
    location.href = "/products";
  } else {
    location.href = "/users/login";
  }
};

document.getElementById("btnLogin").onclick = loginUser;
