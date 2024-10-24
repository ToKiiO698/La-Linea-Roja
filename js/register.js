
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;  // Get the selected role

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('register-message').textContent = 'User registered successfully!';
        } else {
            throw new Error('Failed to register');
        }
    })
    .catch(error => {
        document.getElementById('register-message').textContent = error.message;
    });
});
