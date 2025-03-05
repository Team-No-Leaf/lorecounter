document.addEventListener("DOMContentLoaded", function () {
    const numPlayersSelect = document.getElementById("numPlayers");
    const playerInputsContainer = document.getElementById("playerInputs");
    const startGameButton = document.getElementById("startGame");

    const inks = ["Steel", "Emerald", "Amber", "Amethyst", "Ruby", "Sapphire"];
    const inkColors = {
        "Steel": "#9FA9B3",
        "Emerald": "#298A34",
        "Amber": "#F4B300",
        "Amethyst": "#80387B",
        "Ruby": "#D2082F",
        "Sapphire": "#0089C3"
    };

    function generatePlayerInputs() {
        playerInputsContainer.innerHTML = "";
        let numPlayers = parseInt(numPlayersSelect.value);

        for (let i = 1; i <= numPlayers; i++) {
            let playerDiv = document.createElement("div");
            playerDiv.classList.add("player-input");

            let nameLabel = document.createElement("label");
            nameLabel.innerText = `Player ${i} Name:`;
            let nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.id = `player${i}Name`;
            nameInput.placeholder = `Enter Player ${i} Name`;
            
            let inkLabel = document.createElement("label");
            inkLabel.innerText = `Choose Ink:`;
            
            let inkContainer = document.createElement("div");
            inkContainer.classList.add("ink-container");

            inks.forEach(ink => {
                let inkOption = document.createElement("div");
                inkOption.classList.add("ink-option");
                inkOption.setAttribute("data-ink", ink);
                inkOption.style.backgroundColor = inkColors[ink];

                let inkImg = document.createElement("img");
                inkImg.src = `dlc_ink_${ink.toLowerCase()}.png`;
                inkImg.alt = ink;
                inkImg.classList.add("ink-icon");

                inkOption.appendChild(inkImg);
                inkContainer.appendChild(inkOption);

                // Change background color when ink is selected
                inkOption.addEventListener("click", function () {
                    playerDiv.style.backgroundColor = inkColors[ink];
                    playerDiv.setAttribute("data-selected-ink", ink);
                });
            });

            playerDiv.appendChild(nameLabel);
            playerDiv.appendChild(nameInput);
            playerDiv.appendChild(inkLabel);
            playerDiv.appendChild(inkContainer);
            playerInputsContainer.appendChild(playerDiv);
        }
    }

    numPlayersSelect.addEventListener("change", generatePlayerInputs);
    generatePlayerInputs(); // Initial call to generate inputs

    document.getElementById("setupForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let players = [];
        for (let i = 1; i <= parseInt(numPlayersSelect.value); i++) {
            let name = document.getElementById(`player${i}Name`).value.trim();
            let ink = document.querySelector(`.player-input:nth-child(${i})`).getAttribute("data-selected-ink");

            if (!name) {
                alert(`Player ${i} must have a name!`);
                return;
            }

            if (!ink) {
                alert(`Player ${i} must select an ink color!`);
                return;
            }

            players.push({ name, ink });
        }

        localStorage.setItem("players", JSON.stringify(players));

        if (players.length === 2) {
            window.location.href = "tracker-2p.html";
        } else if (players.length === 3) {
            window.location.href = "tracker-3p.html";
        } else if (players.length === 4) {
            window.location.href = "tracker-4p.html";
        }
    });
});
