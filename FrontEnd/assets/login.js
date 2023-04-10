const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const wrongCombinaison = document.querySelector(".wrong");
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
    } else {
        wrongCombinaison.classList.remove("wrong-animate");
        setTimeout(function() {
            wrongCombinaison.classList.add("wrong-animate");
        }, 10);
        wrongCombinaison.innerHTML = "<p>Email ou Mot de passe incorrect.</p>";
    }
});