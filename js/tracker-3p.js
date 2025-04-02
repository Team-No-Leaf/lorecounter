document.addEventListener("DOMContentLoaded", function () {
    let players = JSON.parse(localStorage.getItem("players")) || [];
    let gamesWon = JSON.parse(localStorage.getItem("gamesWon")) || [0, 0, 0];

    if (players.length !== 3) {
        window.location.href = "index.html";
        return;
    }

    // ✅ Wake Lock
    let wakeLock = null;
    async function enableWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
            } catch (err) {
                console.error("Wake Lock Error:", err);
            }
        }
    }
    enableWakeLock();
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") enableWakeLock();
    });

    // ✅ Hide win buttons initially
    document.getElementById("winButtons").style.display = "none";

    for (let i = 0; i < 3; i++) {
        const section = document.getElementById(`player${i + 1}`);
        const inkSymbol = document.getElementById(`player${i + 1}Ink`);
        const playerName = document.getElementById(`player${i + 1}Name`);
        const gamesWonCounter = document.getElementById(`gamesWon${i + 1}`);

        const ink = players[i].ink.toLowerCase();
        section.style.backgroundColor = getInkColor(ink);
        section.setAttribute("data-ink", ink);
        inkSymbol.src = `dlc_ink_${ink}.png`;
        inkSymbol.alt = ink;
        playerName.innerText = players[i].name;
        gamesWonCounter.innerText = `Games Won: ${gamesWon[i]}`;

        document.getElementById(`increase${i + 1}`).addEventListener("click", () => updateLore(i, 1));
        document.getElementById(`decrease${i + 1}`).addEventListener("click", () => updateLore(i, -1));
    }

    // ✅ Win buttons functionality
    document.getElementById("nextGame").addEventListener("click", resetLore);
    document.getElementById("backToSetup").addEventListener("click", () => {
        localStorage.removeItem("gamesWon");
        window.location.href = "setup.html";
    });

    updateLoreColors();
});

// ✅ Update Lore
function updateLore(playerIndex, change) {
    const loreEl = document.getElementById(`lore${playerIndex + 1}`);
    let currentValue = parseInt(loreEl.innerText);
    const newValue = Math.max(0, Math.min(20, currentValue + change));

    // Stop incrementing past 20
    if (currentValue === 20 && newValue === 20) return;

    loreEl.innerText = newValue;

    if (newValue === 20) {
        handleWin(playerIndex);
    }

    updateLoreColors();
}

// ✅ Handle Game Win
function handleWin(playerIndex) {
    let gamesWon = JSON.parse(localStorage.getItem("gamesWon")) || [0, 0, 0];
    gamesWon[playerIndex]++;
    localStorage.setItem("gamesWon", JSON.stringify(gamesWon));

    document.getElementById(`gamesWon${playerIndex + 1}`).innerText = `Games Won: ${gamesWon[playerIndex]}`;
    document.getElementById("winButtons").style.display = "block";
}

// ✅ Reset Lore for Next Game
function resetLore() {
    for (let i = 0; i < 3; i++) {
        document.getElementById(`lore${i + 1}`).innerText = "0";
    }
    document.getElementById("winButtons").style.display = "none";
    updateLoreColors();
}

// ✅ Lore Color Logic
function updateLoreColors() {
    const loreEls = [1, 2, 3].map(i => document.getElementById(`lore${i}`));
    const values = loreEls.map(el => parseInt(el.innerText));

    const max = Math.max(...values);
    const maxCount = values.filter(v => v === max).length;

    loreEls.forEach(el => el.classList.remove("highest", "lowest"));

    for (let i = 0; i < 3; i++) {
        if (values[i] === max && maxCount === 1) {
            loreEls[i].classList.add("highest");
        } else if (values[i] !== max) {
            loreEls[i].classList.add("lowest");
        }
    }
}

// ✅ Get Ink Color
function getInkColor(ink) {
    const colors = {
        steel: "#9FA9B3",
        emerald: "#298A34",
        amber: "#F4B300",
        amethyst: "#80387B",
        ruby: "#D2082F",
        sapphire: "#0089C3"
    };
    return colors[ink] || "white";
}
