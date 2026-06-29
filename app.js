const TARGET_LORE = 20;
const STORAGE_KEY = "lorcana-scorekeeper-v2";
const URL_PARAMS = new URLSearchParams(location.search);

const INKS = {
  amber: { name: "Amber", color: "#f1c24b", icon: "./assets/ink/dlc_ink_amber.png" },
  amethyst: { name: "Amethyst", color: "#9b61d7", icon: "./assets/ink/dlc_ink_amethyst.png" },
  emerald: { name: "Emerald", color: "#32b56f", icon: "./assets/ink/dlc_ink_emerald.png" },
  ruby: { name: "Ruby", color: "#db3f4e", icon: "./assets/ink/dlc_ink_ruby.png" },
  sapphire: { name: "Sapphire", color: "#2f7ed8", icon: "./assets/ink/dlc_ink_sapphire.png" },
  steel: { name: "Steel", color: "#a8b2ba", icon: "./assets/ink/dlc_ink_steel.png" }
};

const BACKGROUND_IMAGES = [
  "./assets/backgrounds/HeiHei_Mobile_Wallpaper.png",
  "./assets/backgrounds/JimHawkins-SpaceTraveller_Mobile_Wallpaper.png",
  "./assets/backgrounds/JohnSilver_Mobile_Wallpaper.png",
  "./assets/backgrounds/MamaOdie_Mobile_Wallpaper.png",
  "./assets/backgrounds/Scrooge-RichestDuck_Mobile_Wallpaper.png",
  "./assets/backgrounds/Wendy_Mobile_Wallpaper.png",
  "./assets/backgrounds/EnchantedAlice_Mobile_Wallpaper_Credited_NoLogo.png",
  "./assets/backgrounds/EnchantedSnowWhite_Mobile_Wallpaper_Credited_NoLogo.png",
  "./assets/backgrounds/Cinderella-BallroomSensation_Mobile_Wallpaper.png",
  "./assets/backgrounds/Pinocchio_Mobile_Wallpaper_Credited_NoLogo.png",
  "./assets/backgrounds/LittleJohn_Mobile_Wallpaper.png",
  "./assets/backgrounds/RobinHood-CapableFighter_Mobile_Wallpaper.png",
  "./assets/backgrounds/Scar-ViciousCheater_Mobile_Wallpaper.png",
  "./assets/backgrounds/ShereKhan-MenacingPredator_Mobile_Wallpaper.png",
  "./assets/backgrounds/DonaldDuck-DeepSeaDiver_Mobile_Wallpaper.png",
  "./assets/backgrounds/CheshireCat_Mobile_Wallpaper_Credited_NoLogo.png",
  "./assets/backgrounds/BeastRelentless_Mobile_Wallpaper_Credited_NoLogo.png",
  "./assets/backgrounds/EnchantedSisu_Mobile_Wallpaper_Credited_NoLogo.png",
  "./assets/backgrounds/EnchantedHercules_Mobile_Wallpaper_Credited_NoLogo.png",
  "./assets/backgrounds/EnchantedArthur_Mobile_Wallpaper_Credited_NoLogo.png",
  "./assets/backgrounds/BelleStrange_Mobile_Wallpaper_Credited_NoLogo.png",
  "./assets/backgrounds/ArielSinger_Mobile_Wallpaper_Credited_NoLogo.png",
  "./assets/backgrounds/Aurora-DreamingGuardian_Mobile_Wallpaper.png",
  "./assets/backgrounds/Stitch-CarefreeSurfer_Mobile_Wallpaper.png",
  "./assets/backgrounds/Simba-FutureKing_Mobile_Wallpaper.png",
  "./assets/backgrounds/Rapunzel-LettingDownHerHair_Mobile_Wallpaper.png",
  "./assets/backgrounds/PrinceEric_Mobile_Wallpaper.png",
  "./assets/backgrounds/MickeyMouse-WaywardSorcerer_Mobile_Wallpaper.png",
  "./assets/backgrounds/Mickey-BraveLittleTailor_Mobile_Wallpaper.png",
  "./assets/backgrounds/Maleficent-BindingHerTime_Mobile_Wallpaper.png",
  "./assets/backgrounds/Aladdin-HeroicOutlaw_Mobile_Wallpaper.png",
  "./assets/backgrounds/EnchantedElsa_Mobile_Wallpaper.png",
  "./assets/backgrounds/Genie-OnTheJob_Mobile_Wallpaper.png",
  "./assets/backgrounds/Elsa-SnowQueen_Mobile_Wallpaper.png",
  "./assets/backgrounds/Hades-InfernalSchemer_Mobile_Wallpaper.png",
  "./assets/backgrounds/KingTriton_Mobile_Wallpaper.png",
  "./assets/backgrounds/TinkerBell-GiantFairy_Mobile_Wallpaper.png",
  "./assets/backgrounds/Ursula-PowerHungry_Mobile_Wallpaper.png"
];

const defaultState = {
  setupComplete: false,
  playerCount: 2,
  names: ["Amethyst", "Steel", "Ruby", "Sapphire"],
  inks: ["amethyst", "steel", "ruby", "sapphire"],
  matchType: 1,
  scores: [0, 0, 0, 0],
  gameWins: [0, 0, 0, 0],
  history: [],
  notice: "",
  matchLocked: false,
  matchWinner: null
};

let state = loadState();
let landingComplete = URL_PARAMS.has("skipLanding");
let wakeLock = null;

const landingScreen = document.querySelector("#landing-screen");
const landingBg = document.querySelector("#landing-bg");
const landingStart = document.querySelector("#landing-start");
const setupScreen = document.querySelector("#setup-screen");
const scoreScreen = document.querySelector("#score-screen");
const setupForm = document.querySelector("#setup-form");
const setupPlayerEls = [...document.querySelectorAll("[data-setup-player]")];
const playerEls = [0, 1, 2, 3].map((index) => document.querySelector(`.player[data-player="${index}"]`));
const setupNameEls = [0, 1, 2, 3].map((index) => document.querySelector(`#setup-name-${index}`));
const scoreEls = [0, 1, 2, 3].map((index) => document.querySelector(`#score-${index}`));
const nameEls = [0, 1, 2, 3].map((index) => document.querySelector(`#name-${index}`));
const playerInkEls = [0, 1, 2, 3].map((index) => document.querySelector(`#player-ink-${index}`));
const raceNameEls = [0, 1, 2, 3].map((index) => document.querySelector(`#race-name-${index}`));
const raceLaneEls = [0, 1, 2, 3].map((index) => document.querySelector(`.race-lane[data-player="${index}"]`));
const raceProgressEls = [0, 1, 2, 3].map((index) => document.querySelector(`#race-progress-${index}`));
const raceMarkerEls = [0, 1, 2, 3].map((index) => document.querySelector(`#race-marker-${index}`));
const statusTextEls = [document.querySelector("#status-text-away"), document.querySelector("#status-text-home")];
const matchScore = document.querySelector("#match-score");
const matchNameEls = [0, 1, 2, 3].map((index) => document.querySelector(`#match-name-${index}`));
const gameWinEls = [0, 1, 2, 3].map((index) => document.querySelector(`#game-wins-${index}`));
const historyList = document.querySelector("#history-list");
const matchWinnerDialog = document.querySelector("#match-winner-dialog");
const matchWinnerTitle = document.querySelector("#match-winner-title");
const matchTypeDialog = document.querySelector("#match-type-dialog");

if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

const selectedBackground = BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
landingBg.style.backgroundImage = `url("${selectedBackground}")`;
landingScreen.dataset.backgroundCount = String(BACKGROUND_IMAGES.length);
landingScreen.dataset.backgroundFile = selectedBackground.split("/").pop();

landingStart.addEventListener("click", () => {
  landingComplete = true;
  requestImmersiveMode();
  render();
});

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  requestImmersiveMode();
  startMatchFromSetup();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && state.setupComplete) {
    requestWakeLock();
  }
});

document.addEventListener("change", (event) => {
  if (event.target?.name === "player-count") {
    state.playerCount = Number(event.target.value);
    renderSetupVisibility();
  }
});

document.addEventListener("click", (event) => {
  const playerCountLabel = event.target.closest(".player-count label");
  if (playerCountLabel) {
    const input = playerCountLabel.querySelector('input[name="player-count"]');
    if (input) {
      input.checked = true;
      state.playerCount = Number(input.value);
      document.body.dataset.playerCount = String(state.playerCount);
      renderSetupVisibility();
    }
  }

  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  if (action === "change") {
    changeScore(Number(button.dataset.player), Number(button.dataset.delta));
  }
  if (action === "clearHistory") clearHistory();
});

matchWinnerDialog.addEventListener("close", () => {
  if (matchWinnerDialog.returnValue === "setup") {
    showSetup();
  }
  if (matchWinnerDialog.returnValue === "new-match") {
    openDialog(matchTypeDialog);
  }
});

matchTypeDialog.addEventListener("close", () => {
  if (["1", "3", "5"].includes(matchTypeDialog.returnValue)) {
    startNewMatch(Number(matchTypeDialog.returnValue));
  }
});

render();

function startMatchFromSetup() {
  state.playerCount = Number(getCheckedValue("player-count")) || 2;
  state.names = setupNameEls.map((input, index) => input.value.trim() || `Speler ${index + 1}`);
  state.inks = [0, 1, 2, 3].map((index) => getCheckedValue(`ink-${index}`));
  state.matchType = Number(getCheckedValue("match-type"));
  state.setupComplete = true;
  resetMatchState();
  saveAndRender();
}

function startNewMatch(matchType) {
  state.matchType = matchType;
  state.setupComplete = true;
  resetMatchState();
  saveAndRender();
}

function resetMatchState() {
  state.scores = [0, 0, 0, 0];
  state.gameWins = [0, 0, 0, 0];
  state.history = [];
  state.notice = "";
  state.matchLocked = false;
  state.matchWinner = null;
}

function showSetup() {
  state.setupComplete = false;
  state.matchLocked = false;
  state.matchWinner = null;
  state.notice = "";
  saveAndRender();
}

function changeScore(player, delta) {
  if (state.matchLocked || !isActivePlayer(player)) return;

  state.notice = "";
  const previous = [...state.scores];
  const nextScore = clamp(state.scores[player] + delta, 0, 99);
  if (nextScore === state.scores[player]) return;

  state.scores[player] = nextScore;
  state.history.unshift({
    type: "score",
    player,
    playerName: state.names[player],
    delta,
    from: previous[player],
    to: nextScore,
    previous,
    scores: [...state.scores],
    at: new Date().toISOString()
  });

  if (previous[player] < TARGET_LORE && nextScore >= TARGET_LORE) {
    finishGame(player);
  }

  state.history = state.history.slice(0, 24);
  saveAndRender();
}

function finishGame(player) {
  state.gameWins[player] += 1;
  const needed = winsNeeded();
  const gameWins = [...state.gameWins];

  state.history.unshift({
    type: "game",
    player,
    playerName: state.names[player],
    gameWins,
    matchType: state.matchType,
    at: new Date().toISOString()
  });

  if (state.gameWins[player] >= needed) {
    state.matchLocked = true;
    state.matchWinner = player;
    state.notice = `${state.names[player]} wint de match.`;
    window.setTimeout(() => {
      matchWinnerTitle.textContent = `${state.names[player]} wint de match`;
      openDialog(matchWinnerDialog);
    }, 120);
    return;
  }

  state.notice = `${state.names[player]} wint dit potje. Volgende pot gestart.`;
  state.scores = [0, 0];
}

function clearHistory() {
  state.history = [];
  saveAndRender();
}

function render() {
  landingScreen.classList.toggle("hidden", landingComplete);
  setupScreen.classList.toggle("hidden", !landingComplete || state.setupComplete);
  scoreScreen.classList.toggle("hidden", !landingComplete || !state.setupComplete);
  document.body.dataset.playerCount = String(state.playerCount);
  scoreScreen.classList.remove("player-count-2", "player-count-3", "player-count-4");
  scoreScreen.classList.add(`player-count-${state.playerCount}`);

  setupNameEls.forEach((input, index) => {
    if (document.activeElement !== input) input.value = state.names[index];
  });
  renderSetupVisibility();
  setRadio("player-count", String(state.playerCount));
  setRadio("ink-0", state.inks[0]);
  setRadio("ink-1", state.inks[1]);
  setRadio("ink-2", state.inks[2]);
  setRadio("ink-3", state.inks[3]);
  setRadio("match-type", String(state.matchType));

  scoreEls.forEach((element, index) => {
    element.value = state.scores[index];
    element.textContent = state.scores[index];
  });

  playerEls.forEach((element) => {
    const index = Number(element.dataset.player);
    element.dataset.active = String(isActivePlayer(index));
  });

  state.names.forEach((name, index) => {
    const ink = getInk(index);
    playerEls[index].style.setProperty("--seat-color", ink.color);
    nameEls[index].textContent = name;
    playerInkEls[index].innerHTML = inkImage(ink, `${ink.name} inkt`);
    playerInkEls[index].style.setProperty("--ink-color", ink.color);
    raceNameEls[index].innerHTML = `${inkImage(ink, `${ink.name} inkt`)} ${escapeHtml(name)}`;
    raceLaneEls[index].style.setProperty("--ink-color", ink.color);
    raceLaneEls[index].dataset.active = String(isActivePlayer(index));
    matchNameEls[index].innerHTML = `${inkImage(ink, `${ink.name} inkt`)} ${escapeHtml(name)}`;
    matchNameEls[index].closest("[data-player]").dataset.active = String(isActivePlayer(index));
    gameWinEls[index].textContent = state.gameWins[index];
  });

  matchScore.classList.toggle("hidden", state.matchType === 1);
  renderStatus();
  renderHistory();
}

function renderStatus() {
  const active = activePlayers();
  const highest = Math.max(...active.map((index) => state.scores[index]));
  const leaders = active.filter((index) => state.scores[index] === highest);
  const leaderIndex = leaders.length === 1 ? leaders[0] : -1;

  if (state.notice) {
    setStatusText(state.notice);
  } else if (highest >= TARGET_LORE) {
    setStatusText(leaderIndex === -1
      ? `Beide spelers hebben ${TARGET_LORE} lore bereikt.`
      : `${state.names[leaderIndex]} heeft ${TARGET_LORE} lore bereikt.`);
  } else if (leaderIndex === -1) {
    setStatusText(highest === 0 ? `Klaar voor ${matchLabel()}.` : `Gelijkspel op ${highest}.`);
  } else {
    const needed = TARGET_LORE - state.scores[leaderIndex];
    const runnerUp = Math.max(...active.filter((index) => index !== leaderIndex).map((index) => state.scores[index]));
    setStatusText(`${state.names[leaderIndex]} leidt met ${state.scores[leaderIndex] - runnerUp}. Nog ${needed} lore nodig.`);
  }

  state.scores.forEach((score, index) => {
    const progress = `${clamp(score, 0, TARGET_LORE) / TARGET_LORE * 100}%`;
    raceProgressEls[index].style.setProperty("--race-progress", progress);
    raceMarkerEls[index].style.setProperty("--race-progress", progress);
    raceMarkerEls[index].style.setProperty("--ink-color", getInk(index).color);
    raceMarkerEls[index].textContent = score;
  });
}

function setStatusText(text) {
  statusTextEls.forEach((element) => {
    element.textContent = text;
  });
}

function renderHistory() {
  if (state.history.length === 0) {
    historyList.innerHTML = "<li><span>Nog geen acties.</span><span></span></li>";
    return;
  }

  historyList.innerHTML = state.history.slice(0, 8).map((item) => {
    if (item.type === "score") {
      const playerName = item.playerName || state.names[item.player] || "Speler";
      const from = Number.isFinite(item.from) ? item.from : item.previous?.[item.player] ?? "?";
      const to = Number.isFinite(item.to) ? item.to : item.scores?.[item.player] ?? "?";
      return `<li><span><strong>${escapeHtml(playerName)}</strong> van ${from} naar ${to} lore</span><span> Stand ${formatScores(item.scores)}</span></li>`;
    }
    if (item.type === "game") {
      const playerName = item.playerName || state.names[item.player] || "Speler";
      return `<li><span><strong>${escapeHtml(playerName)}</strong> wint potje</span><span> Match ${formatScores(item.gameWins)}</span></li>`;
    }
    return "<li><span>Nieuw spel gestart</span><span> Stand 0 - 0</span></li>";
  }).join("");
}

function renderSetupVisibility() {
  setupPlayerEls.forEach((element) => {
    const index = Number(element.dataset.setupPlayer);
    element.classList.toggle("hidden", index >= state.playerCount);
  });
}

function winsNeeded() {
  return Math.ceil(state.matchType / 2);
}

function matchLabel() {
  return `BO${state.matchType}`;
}

function getInk(index) {
  return INKS[state.inks[index]] || INKS.amber;
}

function activePlayers() {
  return Array.from({ length: state.playerCount }, (_, index) => index);
}

function formatScores(scores) {
  return activePlayers().map((index) => scores?.[index] ?? 0).join(" - ");
}

function isActivePlayer(index) {
  return index >= 0 && index < state.playerCount;
}

function inkImage(ink, alt) {
  return `<img src="${ink.icon}" alt="${escapeHtml(alt)}">`;
}

function getCheckedValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function setRadio(name, value) {
  const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (input) input.checked = true;
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function requestImmersiveMode() {
  requestFullscreenMode();
  requestWakeLock();
}

function requestFullscreenMode() {
  const root = document.documentElement;
  const request = root.requestFullscreen || root.webkitRequestFullscreen || root.msRequestFullscreen;
  if (!request || document.fullscreenElement || document.webkitFullscreenElement) return;
  Promise.resolve(request.call(root)).catch(() => {});
}

function requestWakeLock() {
  if (wakeLock || !navigator.wakeLock?.request) return;
  navigator.wakeLock.request("screen")
    .then((lock) => {
      wakeLock = lock;
      wakeLock.addEventListener?.("release", () => {
        wakeLock = null;
      });
    })
    .catch(() => {});
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  render();
}

function loadState() {
  try {
    if (URL_PARAMS.has("reset")) {
      localStorage.removeItem(STORAGE_KEY);
      return structuredClone(defaultState);
    }
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !Array.isArray(saved.scores) || !Array.isArray(saved.names)) {
      return structuredClone(defaultState);
    }
    return {
      ...structuredClone(defaultState),
      ...saved,
      playerCount: [2, 3, 4].includes(Number(saved.playerCount)) ? Number(saved.playerCount) : 2,
      names: [0, 1, 2, 3].map((index) => saved.names?.[index] || defaultState.names[index]),
      inks: [0, 1, 2, 3].map((index) => saved.inks?.[index] || defaultState.inks[index]),
      scores: [0, 1, 2, 3].map((index) => Number(saved.scores?.[index]) || 0),
      gameWins: [0, 1, 2, 3].map((index) => Number(saved.gameWins?.[index]) || 0),
      matchType: [1, 3, 5].includes(Number(saved.matchType)) ? Number(saved.matchType) : 1,
      history: Array.isArray(saved.history) ? saved.history : []
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
