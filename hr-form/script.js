const cards = document.querySelectorAll('.card');
let currentCardIndex = 0;

// Azure API endpoints
const azureApiBaseUrl = "https://hr-form-a8gjd0bkh7gkh7ck.italynorth-01.azurewebsites.net/api/JobApplication";

// Show the specified card based on index
function showCard(index) {
    cards.forEach((card, i) => {
        card.style.display = i === index ? 'flex' : 'none';
    });
}

// Navigate to the next card
function nextCard() {
    if (currentCardIndex < cards.length - 1) {
        currentCardIndex++;
        showCard(currentCardIndex);
    }
}

// Navigate to the previous card
function prevCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        showCard(currentCardIndex);
    }
}

// Validate personal details form before moving to the next card
async function validatePersonalDetails() {
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!email || !phone) {
        alert('Molimo popunite sva polja u ličnim podacima.');
        return false;
    }

    // Check if the email or phone number exists using Azure API
    const queryParams = new URLSearchParams({ Email: email, PhoneNumber: phone });
    const response = await fetch(`${azureApiBaseUrl}/exists?${queryParams}`, {
        method: "GET",
        headers: { "Accept": "application/json" },
    });

    const result = await response.json();
    if (result.exists) {
        alert("Korisnik sa ovim email-om ili brojem telefona već postoji.");
        return false;
    }

    return true;
}

// Handle form submission
async function submitApplication() {
    const fullName = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const question1 = document.getElementById('question1').value.trim();
    const question2 = document.getElementById('question2').value.trim();
    const question3 = document.getElementById('question3').value.trim();

    const applicationData = {
        fullName,
        email,
        phoneNumber: phone,
        question1Answer: question1,
        question2Answer: question2,
        question3Answer: question3,
    };

    const response = await fetch(`${azureApiBaseUrl}/add`, {
        method: "POST",
        body: JSON.stringify(applicationData),
        headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    if (response.ok) {
        alert('Vaša prijava je uspešno poslata!');
    } else {
        alert('Došlo je do greške prilikom slanja prijave.');
    }

    // Reset the form and navigate back to the first card
    document.getElementById('personal-details-form').reset();
    currentCardIndex = 0;
    showCard(currentCardIndex);
}

// Initialize the first card
showCard(currentCardIndex);

// Event Listeners
document.getElementById('start-button').addEventListener('click', async () => {
    if (await validatePersonalDetails()) {
        nextCard();
    }
});

document.getElementById('proceed-to-questions').addEventListener('click', nextCard);

document.querySelectorAll('.prev-button').forEach(button => {
    button.addEventListener('click', prevCard);
});

document.querySelectorAll('.next-button').forEach(button => {
    button.addEventListener('click', nextCard);
});

document.getElementById('submit-button').addEventListener('click', submitApplication);
