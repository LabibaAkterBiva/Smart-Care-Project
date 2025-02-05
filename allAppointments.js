const loadAllAppointment = () => {
    const patient_id = localStorage.getItem("patient_id");
    fetch(`http://127.0.0.1:8000/appointment/?patient_id=${patient_id}`)
        .then((res) => res.json())
        .then((appointments) => {
            const parent = document.getElementById("table-body");

            appointments.forEach((appointment) => {
                // Fetch doctor details
                fetch(`http://127.0.0.1:8000/doctor/list/${appointment.doctor}`)
                    .then((res) => res.json())
                    .then((doctorData) => {
                        const tr = document.createElement("tr"); // Declare tr here to avoid conflicts
                        tr.id = `appointment-${appointment.id}`; // Assign unique ID

                        tr.innerHTML = `
                            <td>${appointment.id}</td>
                            <td>${appointment.symptom}</td>
                            <td>${doctorData?.user || "Unknown"}</td>
                            <td>${doctorData?.specialization }</td>
                            <td>${doctorData?.fee}</td>
                            <td>${appointment.appointment_type}</td>
                            <td>${appointment.appointment_status}</td>
                            ${
                                appointment.appointment_status === "Pending"
                                    ? `<td><button class="btn btn-danger" onclick="cancelAppointment(${appointment.id}, this)">Cancel</button></td>`
                                    : `<td><button class="btn btn-secondary" disabled>Cancelled</button></td>`
                            }
                        `;
                        parent.appendChild(tr);
                    })
                    .catch((error) => {
                        console.error("Error fetching doctor data:", error);
                    });
            });
        })
        .catch((error) => {
            console.error("Error fetching appointments:", error);
        });
};

// Function to handle canceling and deleting an appointment
const cancelAppointment = (appointmentId, button) => {
    fetch(`http://127.0.0.1:8000/appointment/${appointmentId}/`, {
        method: "DELETE",
    })
        .then((res) => {
            if (res.ok) {
                alert(`Appointment ${appointmentId} has been canceled and deleted.`);
                const row = document.getElementById(`appointment-${appointmentId}`);
                if (row) {
                    row.remove();
                }
            } else {
                alert(`Failed to cancel appointment ${appointmentId}.`);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while canceling the appointment.");
        });
};

// Load appointments when the page loads
loadAllAppointment();
