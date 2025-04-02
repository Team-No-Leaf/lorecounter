document.addEventListener("DOMContentLoaded", function () {
    let players = JSON.parse(localStorage.getItem("players")) || [];
    let gamesWon = JSON.parse(localStorage.getItem("gamesWon")) || [0, 0, 0];

    if (players.length !== 3) {
        window.location.href = "index.html";
        return;
    }

    // Hide win buttons initially
    document.getElementById("winButtons").style.display = "none";

    for (let i = 0; i < 3; i++) {
        let playerSection = document.getElementById(`player${i + 1}`);
        let inkSymbol = document.getElementById(`player${i + 1}Ink`);
        let playerName = document.getElementById(`player${i + 1}Name`);
        let gamesWonCounter = document.getElementById(`gamesWon${i + 1}`);

        if (players[i] && players[i].ink) {
            let ink = players[i].ink.toLowerCase();
            playerSection.style.backgroundColor = getInkColor(ink);
            playerSection.setAttribute("data-ink", ink);
            inkSymbol.src = `dlc_ink_${ink}.png`;
            inkSymbol.alt = ink;
        }

        playerName.innerText = players[i].name;
        gamesWon[i] = gamesWon[i] || 0;
        gamesWonCounter.innerText = `Games Won: ${gamesWon[i]}`;

        document.getElementById(`increase${i + 1}`).addEventListener("click", () => updateLore(i, 1));
        document.getElementById(`decrease${i + 1}`).addEventListener("click", () => updateLore(i, -1));
    }

    document.getElementById("nextGame").addEventListener("click", resetLore);
    document.getElementById("backToSetup").addEventListener("click", function () {
        localStorage.removeItem("gamesWon");
        window.location.href = "setup.html";
    });

    updateLoreColors();
});

function updateLore(playerIndex, change) {
    let loreElement = document.getElementById(`lore${playerIndex + 1}`);
    let currentValue = parseInt(loreElement.innerText);
    let newValue = Math.max(0, Math.min(20, currentValue + change));

    // Block if already at max
    if (currentValue === 20 && newValue === 20) return;

    loreElement.innerText = newValue;

    if (newValue === 20) {
        handleGameWin(playerIndex);
    }

    updateLoreColors();
}

function handleGameWin(winningPlayer) {
    let gamesWon = JSON.parse(localStorage.getItem("gamesWon")) || [0, 0, 0];
    gamesWon[winningPlayer] = (gamesWon[winningPlayer] || 0) + 1;
    localStorage.setItem("gamesWon", JSON.stringify(gamesWon));
    document.getElementById(`gamesWon${winningPlayer + 1}`).innerText = `Games Won: ${gamesWon[winningPlayer]}`;
    document.getElementById("winButtons").style.display = "block";
}

function resetLore() {
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`lore${i}`).innerText = "0";
    }
    document.getElementById("winButtons").style.display = "none";
    updateLoreColors();
}

function updateLoreColors() {
    let loreElements = [
        document.getElementById("lore1"),
        document.getElementById("lore2"),
        document.getElementById("lore3")
    ];

    let loreValues = loreElements.map(el => parseInt(el.innerText));
    let maxLore = Math.max(...loreValues);
    let minLore = Math.min(...loreValues);
    let maxCount = loreValues.filter(val => val === maxLore).length;

    loreElements.forEach(el => el.classList.remove("highest", "lowest"));

    for (let i = 0; i < 3; i++) {
        if (loreValues[i] === maxLore && maxCount === 1) {
            loreElements[i].classList.add("highest");
        } else if (loreValues[i] !== maxLore) {
            loreElements[i].classList.add("lowest");
        }
    }
}

function getInkColor(ink) {
    const colors = {
        "steel": "#9FA9B3",
        "emerald": "#298A34",
        "amber": "#F4B300",
        "amethyst": "#80387B",
        "ruby": "#D2082F",
        "sapphire": "#0089C3"
    };
    return colors[ink] || "white";
}
