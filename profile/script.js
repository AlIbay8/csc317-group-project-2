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
        const getImageData = (imageFile) => new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile)
        })
        getImageData(image).then(function(data) {
            input_info.pfp = data
            // temporary code, need to promisify getNewInfo
            console.log(data);
            pfp_display.src = data
        });
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