
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    fetch('/tickets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => response.json())
    .then(tickets => {
        const ticketsTableBody = document.querySelector('#tickets-table tbody');
        tickets.forEach(ticket => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ticket.id}</td>
                <td>${ticket.title}</td>
                <td>${ticket.description}</td>
                <td>${ticket.status}</td>
            `;
            ticketsTableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching tickets:', error);
    });
});
