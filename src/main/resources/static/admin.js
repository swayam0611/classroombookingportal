async function addRoom() {
    const nameValue = document.getElementById('roomName').value;
    const capacityValue = document.getElementById('roomCap').value;
    const deptValue = document.getElementById('roomDept').value;
    
    const roomData = {
        name: nameValue,
        capacity: Number(capacityValue), // Convert string "40" to number 40
        department: deptValue
    };

    const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
    });

    if (response.ok) {
        alert("Room added successfully!");
        location.reload(); // Refresh the list
    }
}
// This runs as soon as the page opens
window.onload = function() {
    loadRooms();
};

async function loadRooms() {
    const response = await fetch('/api/rooms');
    const rooms = await response.json();
    
    const tableBody = document.getElementById('roomList');
    tableBody.innerHTML = ''; // Clear current list

    rooms.forEach(room => {
        const row = `
            <tr>
                <td>${room.id}</td>
                <td>${room.name}</td>
                <td>${room.department || 'N/A'}</td>
                <td>${room.capacity}</td>
                <td>
                    <button onclick="deleteRoom(${room.id})">Delete</button>
                    <button onclick="modifyRoom(${room.id})">Modify</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

async function deleteRoom(id) {
    if (confirm("Are you sure you want to delete this room?")) {
        await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
        loadRooms(); // Refresh the list
    }
}

async function modifyRoom(id) {
    const nameValue = document.getElementById('roomName').value;
    const capacityValue = document.getElementById('roomCap').value;
    const deptValue = document.getElementById('roomDept').value;
    
    const roomData = {
        name: nameValue,
        capacity: Number(capacityValue), // Convert string "40" to number 40
        department: deptValue
    };

    const response = await fetch(`/api/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
    });

    if (response.ok) {
        alert("Room modified successfully!");
        location.reload(); // Refresh the list
    }
}