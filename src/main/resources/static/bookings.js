window.onload = function() {
    loadBookings();
};

function formatDateTime(timestamp) {
    if (!timestamp) return { date: 'N/A', time: 'N/A' };
    
    const dateObj = new Date(timestamp);
    
    // Formats date to: Apr 8, 2026
    const date = dateObj.toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'short', year: 'numeric' 
    });
    
    // Formats time to: 10:00 AM
    const time = dateObj.toLocaleTimeString('en-IN', { 
        hour: '2-digit', minute: '2-digit', hour12: true 
    });
    
    return { date, time };
}

async function loadBookings() {
    
    const response = await fetch('/api/bookings');
    const booking = await response.json();

    const tableBody = document.getElementById('bookingList');
    tableBody.innerHTML = '';

    booking.forEach (booking =>{
        const start = formatDateTime(booking.startTime);
        const end = formatDateTime(booking.endTime);
        const row = `
        <tr>
                <td>${booking.purpose}</td>
                <td>${start.date}</td>
                <td>${start.time}</td>  
                <td>${end.time}</td>
                <td>${booking.subject}</td>
                <td>${booking.booker.name}</td>
                <td>${booking.professor.name}</td>
                <td>${booking.room.name}</td>
                <td><button onclick="deleteBooking(${booking.id})">Delete</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

async function createBooking() {
    const roomID = document.getElementById('roomID').value;
    const bookingDate = document.getElementById('bookingDate').value;
    const bookingPurpose = document.getElementById('bookingPurpose').value;
    const start_time = document.getElementById('startTime').value;
    const end_time = document.getElementById('endTime').value;
    const bookingSubject = document.getElementById('subject').value;
    const professorID = document.getElementById('professorID').value;

    const startTimeStamp = `${bookingDate}T${start_time}:00`;
    const endTimeStamp = `${bookingDate}T${end_time}:00`;

    const bookingData = {
        purpose: bookingPurpose,
        startTime: startTimeStamp,
        endTime: endTimeStamp,
        subject: bookingSubject,
        professor: {id: professorID},
        room: {id: roomID},
    }

    const response = await fetch('/api/bookings/admin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(bookingData)
    });

    if (response.ok) {
        alert("Room added successfully!");
        location.reload(); // Refresh the list
    }
}

async function deleteBooking(id) {
    const reponse = await fetch(`/api/bookings/${id}`, {method: "DELETE"});
    loadBookings();
}