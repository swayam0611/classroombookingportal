async function createAccount() {
    const userContact = document.getElementById('contactNumber').value;
    const userDivision = document.getElementById('division').value;
    const userEmail = document.getElementById('email').value;
    const userName = document.getElementById('name').value;
    const userOrganization = document.getElementById('organization').value;
    const userRole = document.getElementById('role').value;
    const userPassword = document.getElementById('password').value;

    const userData = {
        contactNumber: userContact,
        division: userDivision,
        email: userEmail,
        name: userName,
        organization: userOrganization,
        role: userRole,
        password: userPassword
    };

    const res = await fetch('api/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData)
    });

    if (res.ok) {
        alert('User created successfully.');
    }
    loadUsers();
}

window.onload = function() {
    loadUsers();
}

async function loadUsers() {
    const res = await fetch('api/users');
    const users = await res.json();

    const tableBody = document.getElementById('userList');
    tableBody.innerHTML = '';

    users.forEach (user => {
        const row = `
        <tr><td>${user.id}</td>
            <td>${user.contactNumber}</td>
            <td>${user.division}</td>
            <td>${user.email}</td>
            <td>${user.name}</td>
            <td>${user.organization}</td>
            <td>${user.role}</td>
            <td><button onclick='deleteUser(${user.id})'>Delete</button></td>
        </tr>
        `;
        tableBody.innerHTML += row;
    });
}

async function deleteUser(id) {
    const res = await fetch(`/api/users/${id}`, {method: 'DELETE'});
    if (res.ok) {
        alert('User Deleted.');
    } else {
        alert(await res.text());
    }
    loadUsers();
}