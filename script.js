
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Invalid credentials');
        }
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        document.getElementById('login-message').textContent = 'Login successful!';
    })
    .catch(error => {
        document.getElementById('login-message').textContent = error.message;
    });
});
