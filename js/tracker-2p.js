document.addEventListener("DOMContentLoaded", function () {
    let players = JSON.parse(localStorage.getItem("players")) || [];

    if (players.length !== 2) {
        window.location.href = "index.html";
        return;
    }

    // Apply settings for each player section
    for (let i = 0; i < 2; i++) {
        let playerSection = document.getElementById(`player${i + 1}`);
        let inkSymbol = document.getElementById(`player${i + 1}Ink`);

        // ✅ Apply background color
        let ink = players[i].ink;
        if (ink) {
            playerSection.setAttribute("data-ink", ink);
            playerSection.style.backgroundColor = getInkColor(ink);
        }

        // ✅ Assign ink icon
        inkSymbol.src = `dlc_ink_${ink.toLowerCase()}.png`;
        inkSymbol.alt = ink;

        // ✅ Add event listeners for lore buttons
        document.getElementById(`increase${i + 1}`).addEventListener("click", function () {
            updateLore(i, 1);
        });

        document.getElementById(`decrease${i + 1}`).addEventListener("click", function () {
            updateLore(i, -1);
        });
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
    let loreValues = [
        parseInt(document.getElementById("lore1").innerText),
        parseInt(document.getElementById("lore2").innerText)
    ];

    let maxLore = Math.max(...loreValues);
    let minLore = Math.min(...loreValues);

    for (let i = 0; i < 2; i++) {
        let loreElement = document.getElementById(`lore${i + 1}`);
        loreElement.classList.remove("highest", "lowest");

        if (loreValues[i] === maxLore && maxLore !== minLore) {
            loreElement.classList.add("highest");
        }
        if (loreValues[i] === minLore && maxLore !== minLore) {
            loreElement.classList.add("lowest");
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
