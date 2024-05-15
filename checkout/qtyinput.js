document.addEventListener("DOMContentLoaded", function() {
    // Get all sets of buttons
    const plusButtons = document.querySelectorAll(".plus");
    const minusButtons = document.querySelectorAll(".minus");
    const numValues = document.querySelectorAll(".num");

    // Loop through each set of buttons
    plusButtons.forEach(function(plus, index) {
        let num = numValues[index];
        let currentValue = parseInt(num.innerText); // Initialize value from the text

        // Add event listener to the plus button
        plus.addEventListener("click", function() {
            currentValue++; // Increment value
            num.innerText = currentValue; // Update the text
            console.log(currentValue);
        });

        // Add event listener to the minus button
        minusButtons[index].addEventListener("click", function() {
            if (currentValue > 0) {
                currentValue--; // Decrement value
                num.innerText = currentValue; // Update the text
                console.log(currentValue);
            }
        });
    });
});