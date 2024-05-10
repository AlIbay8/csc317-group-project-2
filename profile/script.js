document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    const saveChangeBtn = document.getElementById("submit-btn");
    const nameLabel = document.getElementById("name");
    const emailLabel = document.getElementById("email");
    const bioLabel = document.getElementById("bio");
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const bioInput = document.getElementById("bioInput");
    

    function getNewInfo() {
        let input_info = {
            "name": nameInput.value,
            "email": emailInput.value,
            "bio": bioInput.value
        }
        console.log(input_info)
        return input_info
    }

    saveChangeBtn.addEventListener("click", function() {
        updated_info = getNewInfo()
        nameLabel.innerText = updated_info.name
        emailLabel.innerText = updated_info.email
        bioLabel.innerText = updated_info.bio
    })
});