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
    const error_message = document.getElementById("errorMessage")

    function loadDbData(user_id) {
        // load and initialize data from database here
        // needs to be called on page load (to fill input forms with existing data)
    }

    function saveDbData(user_id, data) {
        // send data to database here
    }

    async function getNewInfo() {
        let errors = [];
        const is_email = /^.+@.+$/;
        let input_info = {
            "name": name_input.value,
            "email": email_input.value,
            "bio": bio_input.value,
            "pfp": ""
        }
        let image = pfp_input.files[0];
        if (image.size>1000000) {
            errors.push("Image size is >1 MB")
        }
        if (!is_email.test(input_info.email)) {
            errors.push("Invalid email address")
        }
        const getImageData = (imageFile) => new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile)
        })
        await getImageData(image).then(function(data) {
            input_info.pfp = data
            // temporary code, need to promisify getNewInfo
            console.log(data);
            // pfp_display.src = data
        });
        if (errors.length>0) {
            throw ("Error: " + errors.join(", Error: "))
        }
        return input_info
    }

    save_changes_btn.addEventListener("click", async() => {
        let updated_info = null
        error_message.style.display = "none";
        try {
            updated_info = await getNewInfo();
        } catch (error) {
            console.log("Error: ", error)
            error_message.textContent = error
            error_message.style.display = "flex";
            return
        }
        pfp_display.src = updated_info.pfp
        name_label.innerText = updated_info.name
        email_label.innerText = updated_info.email
        bio_label.innerText = updated_info.bio
        saveDbData(0, 0)
    })
});