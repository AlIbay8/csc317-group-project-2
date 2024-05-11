document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    const save_changes_btn = document.getElementById("submitBtn");
    const name_label = document.getElementById("name");
    const email_label = document.getElementById("email");
    const bio_label = document.getElementById("bio");
    const pfp_display = document.getElementById("pfpDisplay")
    const name_input = document.getElementById("nameInput");
    const email_input = document.getElementById("emailInput");
    const bio_input = document.getElementById("bioInput");
    const pfp_input = document.getElementById("pfpInput");

    function getNewInfo() {
        let input_info = {
            "name": name_input.value,
            "email": email_input.value,
            "bio": bio_input.value,
            "pfp": ""
        }
        let image = pfp_input.files[0];
        //const Get
        let reader = new FileReader();
        reader.onload = function(e) {
            input_info.pfp = e.target.result;
            console.log(pfp_input.files[0])
            console.log(e.target.result)
        }
        reader.readAsDataURL(image);
        return input_info
    }

    save_changes_btn.addEventListener("click", function() {
        updated_info = getNewInfo();
        pfp_display.src = updated_info.pfp
        name_label.innerText = updated_info.name
        email_label.innerText = updated_info.email
        bio_label.innerText = updated_info.bio
    })
});