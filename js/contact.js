
    document.getElementById('contact-form').addEventListener('submit', async function (e) {
        e.preventDefault(); // Sprečava podrazumevano slanje forme

        // Prikupljanje podataka iz forme
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validacija podataka
        if (!name || !email || !message) {
            document.getElementById('form-message').innerHTML = '<span class="text-danger">Sva polja su obavezna.</span>';
            return;
        }

        try {
            // Slanje podataka na server
            const response = await fetch('https://rezotest-dkg4dsdze2c3e7c5.italynorth-01.azurewebsites.net/api/SupportEmail/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Name: name,
                    Email: email,
                    Message: message
                })
            });

            if (response.ok) {
                document.getElementById('form-message').innerHTML = '<span class="text-success">Poruka je uspešno poslata!</span>';
                document.getElementById('contact-form').reset();
            } else {
                const error = await response.text();
                document.getElementById('form-message').innerHTML = `<span class="text-danger">Greška pri slanju poruke: ${error}</span>`;
            }
        } catch (err) {
            document.getElementById('form-message').innerHTML = `<span class="text-danger">Greška pri slanju poruke. Pokušajte ponovo kasnije.</span>`;
            console.error(err);
        }
    });
