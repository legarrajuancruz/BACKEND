function llamarApi() {
  console.log("Llamando a api users");

  fetch("/api/users/65051a60a7efd9b588fa9bf3", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=utf-8",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  }).then((result) => {
    if (result.status === 200) {
      result.json().then((json) => {
        console.log(json);
      });
    } else if (result.status === 401) {
      console.log(result);
      alert("Login invalido, controla tus credenciales");
    }
  });
}
llamarApi();
