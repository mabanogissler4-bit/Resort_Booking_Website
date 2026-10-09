const form = document.getElementById("bookingForm");
const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");
const message = document.getElementById("message");
const checkButton = document.getElementById("checkButton");

// Get today's date in YYYY-MM-DD format
function getToday() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return ${year}-${month}-${day};
}

// Prevent selecting dates in the past
checkIn.min = getToday();
checkOut.min = getToday();

// Update checkout date when check-in changes
checkIn.addEventListener("change", function () {
    checkOut.min = checkIn.value || getToday();

    if (checkOut.value && checkOut.value <= checkIn.value) {
        checkOut.value = "";
    }
});

// Display feedback
function showMessage(text, isSuccess) {
    message.textContent = text;
    message.className = isSuccess ? "success" : "error";
}

// Validate reservation dates
function validateDates() {
    if (!checkIn.value || !checkOut.value) {
        showMessage("Please select both check-in and check-out dates.", false);
        return false;
    }

    if (checkIn.value < getToday()) {
        showMessage("Check-in cannot be in the past.", false);
        return false;
    }

    if (checkOut.value <= checkIn.value) {
        showMessage(
            "Check-out must be later than check-in.",
            false
        );
        return false;
    }

    return true;
}

// Check Availability button
checkButton.addEventListener("click", function () {
    message.textContent = "";
    message.className = "";

    if (!form.reportValidity()) {
        return;
    }

    if (!validateDates()) {
        return;
    }

    showMessage(
        "Your booking details are valid! Actual room availability " +
        "must still be confirmed by the resort.",
        true
    );
});

// Book Now button
form.addEventListener("submit", function (event) {
    event.preventDefault();

    message.textContent = "";
    message.className = "";

    if (!form.reportValidity()) {
        return;
    }

    if (!validateDates()) {
        return;
    }

    const name = document.getElementById("fullName").value.trim();
    const room = document.getElementById("room").value;
    const adults = Number(document.getElementById("adults").value);
    const children = Number(document.getElementById("children").value);

    if (!name || adults < 1 || children < 0 ||
        adults > 20 || children > 20) {
        showMessage("Please check your guest information.", false);
        return;
    }

    const arrival = new Date(checkIn.value + "T00:00:00");
    const departure = new Date(checkOut.value + "T00:00:00");

    const nights = Math.round(
        (departure - arrival) / (1000 * 60 * 60 * 24)
    );

    showMessage(
        Thank you, ${name}! Your ${room} booking request is valid.  +
        Stay: ${nights} night(s). Total guests: ${adults + children}.  +
        "This is a demo confirmation. Your reservation has not been saved.",
        true
    );
});