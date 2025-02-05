/** @format */

const param = new URLSearchParams(window.location.search).get("docId");

const docDetails = document.getElementById("docDetails");
const reviews = document.getElementById("doctor-reviews");
const times = document.getElementById("time");
const reviewContainer = document.getElementById("doctor-reviews-container");

const getParams = () => {
  loadAvailableTimes(param);
  fetch(`http://127.0.0.1:8000/doctor/list/${param}`)
    .then((res) => res.json())
    .then((data) => displayDetails(data));

  fetch(`http://127.0.0.1:8000/doctor/reviews/?doctor_id=${param}`)
    .then((res) => res.json())
    .then((data) => displayReviews(data));
};

const displayDetails = (data) => {
  const div = document.createElement("div");
  div.innerHTML = `
                <div class="d-flex justify-content-center align-items-start gap-5 details">
                <img src="${data?.image}" alt="" srcset="">
                <div class="w-50">
                    <h1 class="doctor_name">
                       ${data?.user} 
                    </h1>
                    <p>${data?.specialization}</p>
                    <h3>
                        ${data?.designation}
                    </h3>
                    <p class="w-50">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam natus debitis veritatis! Aut
                        minus maiores, sit neque vitae commodi consectetur?
                    </p>
                    <h3>Fees: ${data?.fee} BDT</h3>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Take Appointment
                    </button>
                </div>
            </div>`;
  docDetails.appendChild(div);
};

const displayReviews = (data) => {
  if (data.length === 0) {
    reviewContainer.style.display = "none";
  }
  data?.map((review) => {
    const li = document.createElement("li");
    li.innerHTML = `<div class="review_card shadow-lg">
                        <div class="d-flex justify-content-between gap-3">
                            <img src="./Images/girl.png" alt="">
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
};

const loadAvailableTimes = (param) => {
  fetch(
    `http://127.0.0.1:8000/doctor/available-time/?doctor_id=${param}`
  )
    .then((res) => res.json())
    .then((data) => {
      data?.map((time) => {
        const option = document.createElement("option");
        option.value = time.id;
        option.innerHTML = time.name;
        times.appendChild(option);
      });
    });
};

const submitReview = () => {

  const rating = document.getElementById("rating").value;
  const body = document.getElementById("body").value;
  const patient_id = localStorage.getItem("patient_id");
  const doctor_id = param; // Doctor ID from the URL

  console.log("Rating:", rating, "Body:", body, "Patient ID:", patient_id, "Doctor ID:", doctor_id);

  const starRating = rating >= 1 && rating <= 5 ? "⭐".repeat(parseInt(rating)) : ""; // Convert rating to stars

  const reviewData = {
    rating: starRating, 
    body: body,
    patient: patient_id, 
    doctor: doctor_id,   
  };

  console.log("Review Data:", reviewData);

  fetch("http://127.0.0.1:8000/doctor/reviews/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Response Data:", data);
      if (data.success) {
        alert("Your review has been submitted successfully!");
        getParams(); // Reload reviews
      } else {
        alert("Failed to submit review");
      }
    })
    .catch((error) => {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting the review.");
    });
};

const submitForm = () => {
  const status = document.getElementsByName("status");
  const selectedStatus = Array.from(status).find((button) => button.checked);
  console.log(selectedStatus);
  const symptom = document.getElementById("symptom").value;
  const time = document.getElementById("time");
  const selectTime=time.options[time.selectedIndex];
  console.log(selectedStatus,symptom,selectTime);
  const patient_id = localStorage.getItem("patient_id");
  const info = {
    appointment_type: selectedStatus.value,
    appointment_status: "Pending",
    symptom: symptom,
    cancel: false,
    patient: patient_id,
    doctor: param,
    time: selectTime.value,
  };
  console.log(info);
  fetch("http://127.0.0.1:8000/appointment/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  })
    .then((res) => res.json())
    .then((data) =>{
      console.log(data)
      if (selectedStatus.value === "online") {
        window.location.href = "allAppointments.html";
      } else {
        window.location.href = `pdf.html?doctorId=${param}`;
      }
    } 
      );
};


const loadPatientId = () => {
  // Retrieve the user_id from localStorage
  const user_id = localStorage.getItem("user_id");
  console.log("Initial patient_id in localStorage:", localStorage.getItem("patient_id"));

  // If user_id is not present in localStorage, exit the function
  if (!user_id) {
    console.error("User ID is missing in localStorage.");
    return;
  }

  // Remove the previous patient_id from localStorage
  localStorage.removeItem("patient_id");

  // Fetch patient data based on the user_id
  fetch(`http://127.0.0.1:8000/patient/list/?user=${user_id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("API Response:", data);

      // If the data contains at least one patient
      if (data && data.length > 0) {
        // Find the patient matching the user_id
        const patient = data.find(patient => patient.user === parseInt(user_id));
        
        if (patient) {
          // Set patient_id in localStorage if it's not already set
          if (!localStorage.getItem("patient_id")) {
            localStorage.setItem("patient_id", patient.id);
            console.log("New patient_id set in localStorage:", localStorage.getItem("patient_id"));
          }
        } else {
          console.error("No patient found for the given user_id:", user_id);
        }
      } else {
        console.error("No patients found for the user.");
      }
    })
    .catch((error) => {
      console.error("Error fetching patient data:", error);
    });
};

loadPatientId();

getParams();

