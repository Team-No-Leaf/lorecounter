document.addEventListener("DOMContentLoaded", function () {
    let players = JSON.parse(localStorage.getItem("players")) || [];
    let gamesWon = JSON.parse(localStorage.getItem("gamesWon")) || [0, 0, 0];

    if (players.length !== 3) {
        window.location.href = "index.html";
        return;
    }

    // ✅ Apply settings for each player section
    for (let i = 0; i < 3; i++) {
        let playerSection = document.getElementById(`player${i + 1}`);
        let inkSymbol = document.getElementById(`player${i + 1}Ink`);
        let playerName = document.getElementById(`player${i + 1}Name`);
        let gamesWonCounter = document.getElementById(`gamesWon${i + 1}`);

        if (players[i] && players[i].ink) {
            let ink = players[i].ink.toLowerCase();
            let inkColor = getInkColor(ink);

            playerSection.style.backgroundColor = inkColor;
            playerSection.setAttribute("data-ink", players[i].ink.toLowerCase());
            inkSymbol.src = `dlc_ink_${ink}.png`;
            inkSymbol.alt = players[i].ink;
        }

        playerName.innerText = players[i].name;
        gamesWonCounter.innerText = `Games Won: ${gamesWon[i]}`;

        document.getElementById(`increase${i + 1}`).addEventListener("click", () => updateLore(i, 1));
        document.getElementById(`decrease${i + 1}`).addEventListener("click", () => updateLore(i, -1));
    }

    updateLoreColors();
});

// ✅ Function to update lore count
function updateLore(playerIndex, change) {
    let loreElement = document.getElementById(`lore${playerIndex + 1}`);
    let currentValue = parseInt(loreElement.innerText);
    let newValue = Math.max(0, Math.min(20, currentValue + change));

    loreElement.innerText = newValue;

    updateLoreColors();
}

// ✅ Function to update lore colors (green for highest, red for lowest)
function updateLoreColors() {
    let loreElements = [
        document.getElementById("lore1"),
        document.getElementById("lore2"),
        document.getElementById("lore3")
    ];

    let loreValues = loreElements.map(el => parseInt(el.innerText));
    let maxLore = Math.max(...loreValues);
    let minLore = Math.min(...loreValues);
    let maxCount = loreValues.filter(value => value === maxLore).length;

    loreElements.forEach(el => el.classList.remove("highest", "lowest"));

    for (let i = 0; i < 3; i++) {
        if (loreValues[i] === maxLore && maxCount === 1) {
            loreElements[i].classList.add("highest"); // ✅ Highest gets green
        } else {
            loreElements[i].classList.add("lowest"); // ✅ Others turn red
        }

        if (maxCount > 1) {
            loreElements[i].classList.remove("highest", "lowest");
        }
    }
}

// ✅ Function to get ink color
function getInkColor(ink) {
    const colors = {
        "steel": "#9FA9B3",
        "emerald": "#298A34",
        "amber": "#F4B300",
        "amethyst": "#80387B",
        "ruby": "#D2082F",
        "sapphire": "#0089C3"
    };
    return colors[ink] || "white"; // Default to white if ink is unknown
}
