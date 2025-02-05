/** @format */

const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const error = document.getElementById("error");
const confirm_password_error = document.getElementById(
  "confirm_password_error"
);

const registerForm = document.getElementById("register_form");

error.style.display = "none";
confirm_password_error.style.display = "none";

const handleRegister = (event) => {
  event.preventDefault();

  const username = getValue("username");
  const first_name = getValue("first_name");
  const last_name = getValue("last_name");
  const email = getValue("email");
  const password = getValue("password");
  const confirm_password = getValue("confirm_password");
  const info = {
    username,
    first_name,
    last_name,
    email,
    password,
    confirm_password,
  };

  if (regex.test(password)) {
    if (password !== confirm_password) {
      confirm_password_error.style.display = "block";
    } else {
      confirm_password_error.style.display = "none";
      console.log("register", info);

      fetch("http://127.0.0.1:8000/patient/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          alert(data);
          registerForm.reset();
        });
    }
  } else {
    error.style.display = "block";
  }
};

const getValue = (id) => {
  return document.getElementById(id).value;
};

const handlePassValidation = () => {
  const password = document.getElementById("password").value;
  if (regex.test(password)) {
    error.style.display = "none";
  } else {
    error.style.display = "block";
  }
};
