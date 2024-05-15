document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    const login_btn = document.getElementById("loginBtn")
    const signup_btn = document.getElementById("signupBtn")
    const login_error_message = document.getElementById("loginErrorMessage")
    const signup_error_message = document.getElementById("signupErrorMessage")

    function notifyError(error_box, message) {
        error_box.style.display = "flex";
        error_box.textContent = "Error: " + message
    }

    login_btn.addEventListener("click", function() {
        const email_input = document.getElementById("loginEmail")
        const password_input = document.getElementById("loginPassword")

        login_error_message.style.display = "none";
        signup_error_message.style.display = "none";

        console.log(`${email_input.value}, ${password_input.value}`)
        if (!email_input.value || !password_input.value) {
            notifyError(login_error_message, "Please fill in required fields")
            return
        }
    })
    
    signup_btn.addEventListener("click", function() {
        const name_input = document.getElementById("signupName")
        const email_input = document.getElementById("signupEmail")
        const password_input = document.getElementById("signupPassword")
        const confirm_input = document.getElementById("signupConfirmPassword")
        const is_email = /^.+@.+$/;

        login_error_message.style.display = "none";
        signup_error_message.style.display = "none";
        
        console.log(`${name_input.value}, ${email_input.value}, ${password_input.value}, ${confirm_input.value}`)
        if (!email_input.value || !password_input.value || !confirm_input.value) {
            notifyError(signup_error_message, "Please fill in required fields")
            return
        }
        if (!is_email.test(email_input.value)) {
            notifyError("Invalid email address")
        }
        if (password_input.value !== confirm_input.value) {
            notifyError(signup_error_message, "Passwords do not match")
            return
        }
    })
});