document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    const login_btn = document.getElementById("loginBtn")
    const signup_btn = document.getElementById("signupBtn")

    login_btn.addEventListener("click", function() {
        const email_input = document.getElementById("loginEmail")
        const password_input = document.getElementById("loginPassword")
        console.log(email_input.value, " ", password_input.value)
    })
    signup_btn.addEventListener("click", function() {
        const name_input = document.getElementById("signupName")
        const email_input = document.getElementById("signupEmail")
        const password_input = document.getElementById("signupPassword")
        const confirm_input = document.getElementById("signupConfirmPassword")
        console.log(`${name_input.value}, ${email_input.value}, ${password_input.value}, ${confirm_input.value}`)
    })
});