document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    const login_btn = document.getElementById("loginBtn")
    const signup_btn = document.getElementById("signupBtn")
    const login_error_message = document.getElementById("loginErrorMessage")
    const signup_error_message = document.getElementById("signupErrorMessage")
    const signup_success_message = document.getElementById("signupSuccessMessage")

    function notifyError(error_box, message) {
        error_box.style.display = "flex";
        error_box.textContent = "Error: " + message
    }

    //fetch('/user/info?id=4').then((response) => response.json()).then((res) => console.log(res))
    const search_btn = document.getElementById("searchBtn")
    search_btn.addEventListener("click", () => {
        const search_bar = document.getElementById("searchBar")
        let query = search_bar.value.toLowerCase().split(" ")
        if (search_bar.value=="") {
            return
        }
        
        fetch("/game/all").then((response) => response.json()).then((games) => {
            let result = games.reduce((fit, curr) => {
                let score = 0;
                for (let word of query) {
                    if (curr.name.toLowerCase().includes(word)) {
                        score++;
                    }
                }
                return score==query.length ? curr : fit;
            }, null)
            console.log(result)
            if (result===null) {
                alert("Couldn't find game")
            } else {
                window.location.href = `/product/${result.id}`;
            }
        });
    })

    login_btn.addEventListener("click", async () => {
        const email_input = document.getElementById("loginEmail")
        const password_input = document.getElementById("loginPassword")

        login_error_message.style.display = "none";
        signup_error_message.style.display = "none";

        console.log(`${email_input.value}, ${password_input.value}`)
        if (!email_input.value || !password_input.value) {
            notifyError(login_error_message, "Please fill in required fields")
            return
        }

        let email = email_input.value;
        let password = password_input.value;

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
    
            if (response.ok) {
                window.location.href = '/profile';
            } else {
                const errorData = await response.json();
                //alert(errorData.message);
                notifyError(login_error_message, errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            //alert('An error occurred. Please try again.');
            notifyError(login_error_message, error)
        }
    })
    
    signup_btn.addEventListener("click", async() => {
        const name_input = document.getElementById("signupName")
        const email_input = document.getElementById("signupEmail")
        const password_input = document.getElementById("signupPassword")
        const confirm_input = document.getElementById("signupConfirmPassword")
        const is_email = /^.+@.+$/;

        login_error_message.style.display = "none";
        signup_error_message.style.display = "none";
        signup_success_message.style.display = "none";
        
        console.log(`${name_input.value}, ${email_input.value}, ${password_input.value}, ${confirm_input.value}`)
        if (!email_input.value || !password_input.value || !confirm_input.value) {
            notifyError(signup_error_message, "Please fill in required fields")
            return
        }
        if (!is_email.test(email_input.value)) {
            notifyError(signup_error_message, "Invalid email address")
        }
        if (password_input.value !== confirm_input.value) {
            notifyError(signup_error_message, "Passwords do not match")
            return
        }

        let name = name_input.value ? name_input.value : "User";
        let email = email_input.value;
        let password = password_input.value;

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
    
            if (response.ok) {
                document.getElementById("signupForm").reset();
                signup_success_message.style.display = "flex";
            } else {
                const errorData = await response.json();
                //alert(errorData.message);
                notifyError(signup_error_message, errorData.message)
            }
        } catch (error) {
            console.error('Error:', error);
            //alert('An error occurred. Please try again.');
            notifyError(signup_error_message, "error")
        }
    })
});