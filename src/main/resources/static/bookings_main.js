window.onload = function () {
    displayUser();
}

async function userLogOut() {
    await fetch('/api/users/login');
    window.location.href = "login.html";
}

let user;

async function displayUser() {
    const check_session = await fetch('api/check-session');
    if (check_session.ok) {
        const email = await check_session.text();
        const res = await fetch(`api/users/${email}`);
        user = await res.json();
        const displayElement = document.getElementById('userDisplay');
        if (displayElement) {
            displayElement.innerText = `${user.name}`;
        }
    } else {
        window.location.href = "login.html";
    }
}

// State management for the current view
let currentDate = new Date(); // Defaults to today (April 10, 2026)
let selectedDate = new Date();

function getFormattedDate(dateObj) {
    const year = dateObj.getFullYear();
    
    // getMonth() is 0-indexed (Jan = 0), so we add 1
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


function initCalendar() {
    renderCalendar();
}

function renderCalendar() {
    const monthYearDisplay = document.getElementById('monthYear');
    const calendarGrid = document.querySelector('.calendar-grid');
    
    // 1. Clear previous dates (keep the day labels S, M, T...)
    const dayLabels = calendarGrid.querySelectorAll('.calendar-day-label');
    calendarGrid.innerHTML = '';
    dayLabels.forEach(label => calendarGrid.appendChild(label));

    // 2. Set Header (e.g., "April 2026")
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    monthYearDisplay.innerText = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // 3. Logic for Date Calculation
    const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const prevLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

    // 4. Fill Previous Month's Days (Grayed out)
    for (let x = firstDayIndex; x > 0; x--) {
        const div = document.createElement('div');
        div.className = 'calendar-date other-month';
        div.innerText = prevLastDate - x + 1;
        calendarGrid.appendChild(div);
    }

    // 5. Fill Current Month's Days
    for (let i = 1; i <= lastDate; i++) {
        const div = document.createElement('div');
        div.className = 'calendar-date';
        div.innerText = i;

        // Highlight Today
        const today = new Date();
        if (i === today.getDate() && 
            currentDate.getMonth() === today.getMonth() && 
            currentDate.getFullYear() === today.getFullYear()) {
            div.classList.add('today');
        }

        // Highlight Selected Date
        if (i === selectedDate.getDate() && 
            currentDate.getMonth() === selectedDate.getMonth() && 
            currentDate.getFullYear() === selectedDate.getFullYear()) {
            div.classList.add('active');
        }

        // Add Click Event
        div.onclick = () => selectDate(i);
        calendarGrid.appendChild(div);
    }
}

function selectDate(day) {
    selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Update UI
    renderCalendar();
    
    // Format for backend/display (YYYY-MM-DD)
    const formattedDate = selectedDate.toISOString().split('T')[0];
    console.log("Selected Date for Bookings:", formattedDate);

    // const roomId = document.getElementById('selectedRoomId').value;
    // fetchBookingsByRoomId(roomId);
    
    // TRIGGER: Refresh the room booking table for this date
    if (typeof loadBookingsByDate === 'function') {
        loadBookingsByDate(formattedDate);
    }
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
}

//functions for showing deparments

function showDepts() {
    document.getElementById('deptView').style.display = 'block';
    document.getElementById('roomView').style.display = 'none';
    document.getElementById('scheduleView').style.display = 'none';
    document.getElementById('userBookingsView').style.display = 'none';
}

// functions for showing rooms

async function showRooms(dept) {

    document.getElementById('deptView').style.display = 'none';
    document.getElementById('roomView').style.display = 'block';
    document.getElementById('scheduleView').style.display = 'none';
    document.getElementById('displayRoom').value = '';

    document.getElementById('selectedDeptName').innerText = dept;

    fetchRoomsByDept(dept);
}

async function fetchRoomsByDept(dept) {
    const res = await fetch(`/api/rooms/${dept}`);
    const dept_rooms = await res.json();

    const roomContainer = document.getElementById('roomBtnContainer');
    roomContainer.innerHTML = '';
    
    if (Array.isArray(dept_rooms)) {
        dept_rooms.forEach(room => {
            const btn = `
                <div class="card-btn" onclick="showSchedule(${room.id}, '${room.name}')">
                    ${room.name}
                </div>`;
            roomContainer.innerHTML += btn;
        });
    } else {
        console.error("Expected an array but got:", dept_rooms);
        container.innerHTML = '<p>No rooms found for this department.</p>';
    }
}

function formatDateTime(isoString) {
    if (!isoString) return { date: '', time: '' };
    
    const dateObj = new Date(isoString);
    
    // Extracts the date: e.g., "10 Apr 2026"
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-GB', dateOptions);
    
    // Extracts the time: e.g., "02:30 PM"
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);
    
    return {
        date: formattedDate,
        time: formattedTime
    };
}

//functions for showing schedule

async function showSchedule(roomId, roomName) {
    document.getElementById('roomView').style.display = 'none';
    document.getElementById('scheduleView').style.display = 'block';
    document.getElementById('displayRoom').value = roomId;
    document.getElementById('form-group-error-msg').style.display = 'none';

    const date_sel = formatDateTime(selectedDate).date;

    document.getElementById('selectedRoomName').innerText = `${roomName}, on ${date_sel}`;
    document.getElementById('selectedRoomId').innerText = roomId;

    fetchBookingsByRoomId(roomId);
}

async function fetchBookingsByRoomId(roomId) {
        const formattedDate = getFormattedDate(selectedDate);
        
        // 1. Always use a leading slash for reliability
        const res = await fetch(`/api/bookings/${roomId}/${formattedDate}`);
        const bookings = await res.json();
        
        const tableBody = document.getElementById('bookingList');
        
        // 2. CRITICAL: Clear the table before adding new rows
        // Otherwise, clicking different rooms will just keep appending rows forever
        tableBody.innerHTML = '';
    
        if (bookings.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No bookings for this date.</td></tr>';
            return;
        }
    
        bookings.forEach(booking => {
            // 3. Format the times so they look like "10:00 AM" instead of "2026-04-10T10:00:00"
            const start = formatDateTime(booking.startTime).time;
            const end = formatDateTime(booking.endTime).time;
    
            const row = `
                <tr>
                    <td>${start} - ${end}</td>
                    <td>${booking.booker.division} - ${booking.booker.organization}</td>
                    <td>${booking.purpose}</td>
                    <td>${booking.subject}</td>
                    <td>${booking.professor?.name || 'N/A'}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }


//functions for creating a booking

async function createBooking() {
    const roomId = document.getElementById('displayRoom').value;
    if (roomId === '') {
        document.getElementById('form-group-error-msg').style.display = 'block';
        return;
    }
    const bookingPurpose = document.getElementById('purpose').value;
    const start = document.getElementById('startTime').value;
    const end = document.getElementById('endTime').value;
    const professorId = document.getElementById('professor').value;
    const sub = document.getElementById('subject').value;

    const bookingDate = getFormattedDate(selectedDate);

    const startTimeStamp = `${bookingDate}T${start}:00`;
    const endTimeStamp = `${bookingDate}T${end}:00`;


    if (!purpose || !startTime || !endTime || !sub || !professorId) {
        document.getElementById('form-group-error-msg-2').style.display = 'block';
        return;
    }

    const bookingData = {
        purpose: bookingPurpose,
        startTime: startTimeStamp,
        endTime: endTimeStamp,
        subject: sub,
        professor: {id: professorId},
        room: {id: roomId}
    }

    const response = await fetch(`/api/bookings`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(bookingData)
    });

    if (response.ok) {
        alert("Room added successfully!");
        location.reload(); // Refresh the list
    } else {
        alert(await response.text());
    }
}


//displying user bookings

async function userBookings() {
    document.getElementById('deptView').style.display = 'none';
    document.getElementById('scheduleView').style.display = 'none';
    document.getElementById('roomView').style.display = 'none';
    document.getElementById('userBookingsView').style.display = 'block';

    document.getElementById('userName').innerText = user.name;

    displayUserBookings();
}

async function displayUserBookings() {
    const res = await fetch(`/api/bookings/user/${user.id}`);
    const bookings = await res.json();

    const tableBody = document.getElementById('userBookingList');
    tableBody.innerHTML = '';

    if (bookings.length === 0) {
        tableBody.innerHTML = '<tr><td colspan=7 style="text-align:center">You have made no bookings</td></tr>';
    }

    bookings.forEach(booking => {
        const start = formatDateTime(booking.startTime).time;
        const end = formatDateTime(booking.endTime).time;
        const date = formatDateTime(booking.startTime).date;
    
        const row = `
                <tr>
                    <td>${date}</td>
                    <td>${booking.room.name}</td>
                    <td>${start}</td>
                    <td>${end}</td>
                    <td>${booking.subject}</td>
                    <td>${booking.professor?.name || 'N/A'}</td>
                    <td><button class="action-btns" onclick="deleteBooking(${booking.id})")>Delete</button>
                </tr>
            `;
        tableBody.innerHTML += row;
    });
}

async function deleteBooking(id) {
    const res = await fetch(`/api/bookings/${id}`, {method: 'DELETE'});
    displayUserBookings();
}
