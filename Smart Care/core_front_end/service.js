/** @format */

const param = new URLSearchParams(window.location.search).get("sid");
console.log(param);

const sDetails = document.getElementById("sDetails");

const getParams = () => {
  fetch(`http://127.0.0.1:8000/service/${param}`)
    .then((res) => res.json())
    .then((data) => displayDetails(data));
   console.log("data")
};

const displayDetails = (data) => {
  const div = document.createElement("div");
  div.innerHTML = `
                <div class="d-flex justify-content-center align-items-start gap-5 simage">
                <img src="${data?.image}" alt="" srcset="">
                <div class="w-50">
                    <h1 class="doctor_name">
                       ${data?.name} 
                    </h1>
                <p>${data?.description}</p>

            </div>`;
  sDetails.appendChild(div);
};

getParams();

