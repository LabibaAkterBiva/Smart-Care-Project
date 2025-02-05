/** @format */

const services = document.getElementById("services");
const designations = document.getElementById("designation");
const specializations = document.getElementById("specialization");
const doctors = document.getElementById("doctors");
const nodata = document.getElementById("nodata");
const spinner = document.getElementById("spinner");
const reviews = document.getElementById("reviews");

const loadServices = () => {
  fetch("http://127.0.0.1:8000/service/")
    .then((res) => res.json())
    .then((data) => displayServices(data))
    .catch((error) => console.log(error));
};

const displayServices = (data) => {
  data?.map((service) => {
    const serviceList = document.createElement("li");
    serviceList.innerHTML = `
            <div class="card shadow h-100">
                <div class="ratio ratio-16x9">
                    <img src="${
                      service.image
                    }" class="card-img-top" loading="lazy" alt="${
      service.name
    }">
                </div>
                <div class="card-body p-3 p-xl-5">
                    <h3 class="card-title h5">${service.name}</h3>
                    <p class="card-text" style='width:100%'>${service.description.slice(
                      0,
                      100
                    )}</p>
                    <div><a href="login.html" class="btn btn-primary">See Details</a>
                    </div>
                </div>
            </div>
        `;
    services.appendChild(serviceList);
  });
};

const loadDesignation = () => {
  fetch("http://127.0.0.1:8000/doctor/designation/")
    .then((res) => res.json())
    .then((data) => {
      data?.map((designation) => {
        const designationList = document.createElement("li");
        designationList.innerHTML = `
                    <button onclick="loadDoctors('${designation.slug}')" class="dropdown-item" href="#">${designation.name}</button>
                `;
        designations.appendChild(designationList);
      });
    })
    .catch((error) => console.log(error));
};

const loadSpecialization = () => {
  fetch("http://127.0.0.1:8000/doctor/specialization/")
    .then((res) => res.json())
    .then((data) => {
      data?.map((specialization) => {
        const specializationList = document.createElement("li");
        specializationList.innerHTML = `
                    <button onclick="loadDoctors('${specialization.slug}')" class="dropdown-item" href="#">${specialization.name}</button>
                `;
        specializations.appendChild(specializationList);
      });
    })
    .catch((error) => console.log(error));
};

const loadDoctors = (search) => {
  doctors.innerText = "";
  spinner.style.display = "block";
  nodata.style.display = "none";
  fetch(
    `http://127.0.0.1:8000/doctor/list/?search=${search ? search : ""}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data?.count === 0) {
        console.log("hello wo3rld");
        spinner.style.display = "none";
        nodata.style.display = "block";
      } else {
        spinner.style.display = "none";
        nodata.style.display = "none";
        data?.results?.map((doctor) => {
          const div = document.createElement("div");
          div.classList.add("col-4");
          div.innerHTML = `
                <div class="card w-100 ">
                    <img src="${doctor.image}" class="doc_card_img rounded-circle m-auto" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${doctor.user}</h5>
                        <p class="card-text">${doctor.designation}</p>
                        <p class="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, exercitationem reiciendis accusamus</p>
                            <p ><small class="text-muted">${doctor.specialization}</small></p>
                        <a href="login.html" class="btn btn-primary">View Details</a>
                    </div>
                </div>
                `;
          doctors.appendChild(div);
        });
      }
    });
};

const handleSearch = (event) => {
  event.preventDefault();
  const search = document.getElementById("search").value;
  console.log(search);
  loadDoctors(search);
};

const loadReviews = () => {
  fetch("http://127.0.0.1:8000/doctor/reviews/")
    .then((res) => res.json())
    .then((data) => {
      data?.map((review) => {
        const li = document.createElement("li");
        li.innerHTML = `<div class="review_card shadow-lg">
                          
                          <img src="./Images/girl.png" alt="" />
                        <div class="d-flex justify-content-between gap-3">
                            <img src="${review.reviewer}" alt="">
                            <div>
                                <h3>${review.patient}</h3>
                                <p>${review.rating}</p>
                            </div>
                        </div>
                        <p>
                           ${review.body.slice(0, 150)} 
                        </p>
                    </div>`;
        reviews.appendChild(li);
      });
    });
};

loadServices();
loadDesignation();
loadSpecialization();
loadDoctors();
loadReviews();
