document.addEventListener("DOMContentLoaded", function () {
    let players = JSON.parse(localStorage.getItem("players")) || [];
    let gamesWon = JSON.parse(localStorage.getItem("gamesWon")) || [0, 0];

    if (players.length !== 2) {
        window.location.href = "index.html";
        return;
    }

    // ✅ Wake Lock (Prevent Screen from Sleeping)
    let wakeLock = null;
    
    async function enableWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
                console.log("✅ Screen Wake Lock Enabled");
            } catch (err) {
                console.error("⚠️ Wake Lock Error:", err);
            }
        }
    }

    // ✅ Enable Wake Lock when page loads
    enableWakeLock();

    // ✅ Re-enable Wake Lock when visibility changes
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            enableWakeLock();
        }
    });

    // ✅ Hide win buttons initially
    let winButtons = document.getElementById("winButtons");
    winButtons.style.display = "none";

    // ✅ Apply settings for each player section
    for (let i = 0; i < 2; i++) {
        let playerSection = document.getElementById(`player${i + 1}`);
        let inkSymbol = document.getElementById(`player${i + 1}Ink`);
        let playerName = document.getElementById(`player${i + 1}Name`);
        let gamesWonCounter = document.getElementById(`gamesWon${i + 1}`);

        // ✅ Restore background color
        let ink = players[i].ink;
        if (ink) {
            playerSection.style.backgroundColor = getInkColor(ink);
            playerSection.setAttribute("data-ink", ink);
        }

        // ✅ Restore ink icon
        inkSymbol.src = `dlc_ink_${ink.toLowerCase()}.png`;
        inkSymbol.alt = ink;

        // ✅ Assign player name
        playerName.innerText = players[i].name;

        // ✅ Assign games won counter
        gamesWonCounter.innerText = `Games Won: ${gamesWon[i]}`;

        // ✅ Add event listeners for lore buttons
        document.getElementById(`increase${i + 1}`).addEventListener("click", function () {
            updateLore(i, 1);
        });

        document.getElementById(`decrease${i + 1}`).addEventListener("click", function () {
            updateLore(i, -1);
        });
    }

    // ✅ Ensure win buttons work
    document.getElementById("nextGame").addEventListener("click", resetLore);
    document.getElementById("backToSetup").addEventListener("click", function () {
        localStorage.removeItem("gamesWon"); // Reset games won when going back
        window.location.href = "setup.html";
    });

    updateLoreColors();
});

// ✅ Function to update lore count
function updateLore(playerIndex, change) {
    let loreElement = document.getElementById(`lore${playerIndex + 1}`);
    let currentValue = parseInt(loreElement.innerText);
    let newValue = Math.max(0, Math.min(20, currentValue + change));

    // ✅ Prevent further increases after reaching 20 lore
    if (currentValue === 20 && newValue === 20) return;

    loreElement.innerText = newValue;

    if (newValue === 20) {
        handleGameWin(playerIndex);
    }

    updateLoreColors();
}

// ✅ Function to handle game win and show buttons
function handleGameWin(winningPlayer) {
    let gamesWon = JSON.parse(localStorage.getItem("gamesWon")) || [0, 0];

    // ✅ Increase winner's game count only once
    if (gamesWon[winningPlayer] === undefined) {
        gamesWon[winningPlayer] = 0;
    }
    gamesWon[winningPlayer]++;
    localStorage.setItem("gamesWon", JSON.stringify(gamesWon));

    // ✅ Update UI
    document.getElementById(`gamesWon${winningPlayer + 1}`).innerText = `Games Won: ${gamesWon[winningPlayer]}`;

    // ✅ Show win buttons
    let winButtons = document.getElementById("winButtons");
    winButtons.style.display = "block";
}

// ✅ Function to reset lore for next game
function resetLore() {
    document.getElementById("lore1").innerText = "0";
    document.getElementById("lore2").innerText = "0";

    // ✅ Hide win buttons again
    let winButtons = document.getElementById("winButtons");
    winButtons.style.display = "none";

    updateLoreColors();
}

// ✅ Function to update lore colors (green for highest, red for lowest)
function updateLoreColors() {
    let loreElements = [document.getElementById("lore1"), document.getElementById("lore2")];
    let loreValues = loreElements.map(el => parseInt(el.innerText));

    let maxLore = Math.max(...loreValues);
    let minLore = Math.min(...loreValues);

    // ✅ Fix: Clear previous styles before updating
    loreElements.forEach(el => el.classList.remove("highest", "lowest"));

    for (let i = 0; i < 2; i++) {
        if (loreValues[i] === maxLore && maxLore !== minLore) {
            loreElements[i].classList.add("highest");
        }
        if (loreValues[i] === minLore && maxLore !== minLore) {
            loreElements[i].classList.add("lowest");
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
