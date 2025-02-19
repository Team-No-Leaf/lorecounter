document.addEventListener("DOMContentLoaded", function () {
    const playerCountSelect = document.getElementById("playerCount");
    const playerInputsDiv = document.getElementById("playerInputs");
    const startGameButton = document.getElementById("startGame");

    const inks = [
        { name: "amber", color: "#F4B300" },
        { name: "amethyst", color: "#80387B" },
        { name: "emerald", color: "#298A34" },
        { name: "ruby", color: "#D2082F" },
        { name: "sapphire", color: "#0089C3" },
        { name: "steel", color: "#9FA9B3" }
    ];

    function updatePlayerInputs() {
        const playerCount = parseInt(playerCountSelect.value);
        playerInputsDiv.innerHTML = "";

        for (let i = 1; i <= playerCount; i++) {
            const playerDiv = document.createElement("div");
            playerDiv.classList.add("player-input");

            // Player Name Input
            const nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.placeholder = `Player ${i} Name`;
            nameInput.required = true;

            // Ink Selection
            const inkSelectionDiv = document.createElement("div");
            inkSelectionDiv.classList.add("ink-selection");

            inks.forEach(ink => {
                const img = document.createElement("img");
                img.src = `dlc_ink_${ink.name}.png`;
                img.alt = ink.name;
                img.classList.add("ink-icon");
                img.dataset.ink = ink.name;

                img.addEventListener("click", function () {
                    inkSelectionDiv.querySelectorAll(".ink-icon").forEach(icon => {
                        icon.classList.remove("selected");
                    });
                    img.classList.add("selected");

                    // ✅ Change player section background color based on selected ink
                    playerDiv.style.backgroundColor = ink.color;

                    // ✅ Check if all fields are filled after selection
                    validateForm();
                });

                inkSelectionDiv.appendChild(img);
            });

            nameInput.addEventListener("input", validateForm);

            playerDiv.appendChild(nameInput);
            playerDiv.appendChild(inkSelectionDiv);
            playerInputsDiv.appendChild(playerDiv);
        }

        startGameButton.style.display = "block";
        validateForm(); // Ensure the button is disabled until fields are filled
    }

    // ✅ Listen for changes in player count
    playerCountSelect.addEventListener("change", updatePlayerInputs);

    // ✅ Validate Form: Enable Button Only When All Fields Are Set
    function validateForm() {
        const playerInputs = document.querySelectorAll(".player-input input");
        const allNamesFilled = [...playerInputs].every(input => input.value.trim() !== "");
        const allInksSelected = [...document.querySelectorAll(".player-input .ink-selection")].every(
            selection => selection.querySelector(".ink-icon.selected")
        );

        if (allNamesFilled && allInksSelected) {
            startGameButton.removeAttribute("disabled");
        } else {
            startGameButton.setAttribute("disabled", "true");
        }
    }

    // ✅ Ensure Start Game button redirects when all players are set up
    startGameButton.addEventListener("click", function () {
        const playerInputs = document.querySelectorAll(".player-input input");
        let playerData = [];

        playerInputs.forEach((input, index) => {
            const selectedInk = input.parentElement.querySelector(".ink-icon.selected");
            playerData.push({
                name: input.value.trim(),
                ink: selectedInk ? selectedInk.dataset.ink : null
            });
        });

        localStorage.setItem("players", JSON.stringify(playerData));

        // ✅ Redirect to the correct tracker page
        const playerCount = parseInt(playerCountSelect.value);
        if (playerCount === 2) {
            location.href = "tracker-2p.html";
        } else if (playerCount === 3) {
            location.href = "tracker-3p.html"; // To be created later
        } else if (playerCount === 4) {
            location.href = "tracker-4p.html"; // To be created later
        }
    });

    // ✅ Initialize Inputs on Page Load
    updatePlayerInputs();
});
