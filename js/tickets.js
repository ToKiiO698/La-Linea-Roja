
document.getElementById('ticket-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const token = localStorage.getItem('token');

    fetch('/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('ticket-message').textContent = 'Ticket created successfully!';
        } else {
            throw new Error('Failed to create ticket');
        }
    })
    .catch(error => {
        document.getElementById('ticket-message').textContent = error.message;
    });
});
