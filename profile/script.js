document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    const saveChangeBtn = document.getElementById("submit-btn");
    const nameLabel = document.getElementById("name");
    const emailLabel = document.getElementById("email");
    const bioLabel = document.getElementById("bio");

    saveChangeBtn.addEventListener("click", function() {
        nameLabel.innerText = "name";
        emailLabel.innerText = "email"
        bioLabel.innerText = "bio"
    })
});