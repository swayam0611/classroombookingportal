window.onload = function () {
    loadProfessors();
}

async function createAccount() {
    const profId = document.getElementById('id').value;
    const profDept = document.getElementById('department').value;
    const profName = document.getElementById('name').value;

    const profData = {
        id: profId,
        department: profDept,
        name: profName
    };

    const res = await fetch('api/professor', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(profData)
    });

    alert(await res.text());

    await loadProfessors();
}

async function loadProfessors() {
    const res = await fetch('api/professor');
    const professors = await res.json();

    const tableBody = document.getElementById('profsList');
    tableBody.innerHTML = '';

    professors.forEach(professor => {
        const row = `
            <tr>
            <td>${professor.id}</td>
            <td>${professor.department}</td>
            <td>${professor.name}</td>
            <td><button onclick="deleteProf(${professor.id})">Delete</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    })
}

async function deleteProf(id) {
    const res = await fetch(`/api/professor/${id}`, {method: 'DELETE'});
    alert(await res.text());

    await loadProfessors();
}