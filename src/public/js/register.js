/*==========================
-        REGISTER           -
===========================*/

const registerUser = async () => {
  let first_name = document.getElementById("first_name").value;
  let last_name = document.getElementById("last_name").value;
  let email = document.getElementById("email").value;
  let age = document.getElementById("edad").value;
  let password = document.getElementById("password").value;

  const user = { first_name, last_name, email, age, password };

  console.log(user);

  const response = await fetch("/api/sessions/register", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  if (data) {
    location.href = "/api/users/login";
  }
};

document.getElementById("btnRegister").onclick = registerUser;
