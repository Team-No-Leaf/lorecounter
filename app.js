const CORE_TARGET_LORE = 20;
const COCONUT_TARGET_LORE = 25;
const DEFAULT_TIMER_SECONDS = 50 * 60;
const TIMER_OPTIONS = [0, 50 * 60, 55 * 60, 70 * 60];
const OVERTIME_TURNS = 5;
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

const COCONUT_COMMANDERS = [
  { id: "scar-finally-king", name: "Scar", title: "Finally King", fullName: "Scar - Finally King", colors: ["steel"], ability: "During your turn, you pay 1 ink less for the first Ally character you play.", oncePerGame: false, art: "./assets/commanders/scar-finally-king.jpg" },
  { id: "ariel-spectacular-singer", name: "Ariel", title: "Spectacular Singer", fullName: "Ariel - Spectacular Singer", colors: ["amber"], ability: "Whenever a Princess character of yours sings a song, gain lore equal to her lore.", oncePerGame: false, art: "./assets/commanders/ariel-spectacular-singer.jpg" },
  { id: "winnie-the-pooh-hunny-wizard", name: "Winnie the Pooh", title: "Hunny Wizard", fullName: "Winnie the Pooh - Hunny Wizard", colors: ["amethyst"], ability: "Whenever you play a character without an ability, you may pay 1 ink to draw a card.", oncePerGame: false, art: "./assets/commanders/winnie-the-pooh-hunny-wizard.jpg" },
  { id: "stitch-rock-star", name: "Stitch", title: "Rock Star", fullName: "Stitch - Rock Star", colors: ["amber"], ability: "Once during your turn, you may play a character with cost 2 or less for free. If that character was named Lilo or Stitch, chosen character gets +1 lore this turn.", oncePerGame: false, art: "./assets/commanders/stitch-rock-star.jpg" },
  { id: "ursula-deceiver-of-all", name: "Ursula", title: "Deceiver of All", fullName: "Ursula - Deceiver of All", colors: ["emerald"], ability: "Your characters count as having +1 cost for singing songs. Your characters named Ursula count as having +2 cost instead.", oncePerGame: false, art: "./assets/commanders/ursula-deceiver-of-all.jpg" },
  { id: "mickey-mouse-brave-little-tailor", name: "Mickey Mouse", title: "Brave Little Tailor", fullName: "Mickey Mouse - Brave Little Tailor", colors: ["ruby"], ability: "Mickey Mouse character cards in your hand, deck, and discard gain Shift 2 ink.", oncePerGame: false, art: "./assets/commanders/mickey-mouse-brave-little-tailor.jpg" },
  { id: "mufasa-ruler-of-pride-rock", name: "Mufasa", title: "Ruler of Pride Rock", fullName: "Mufasa - Ruler of Pride Rock", colors: ["sapphire"], ability: "Once during your turn, you may pay 5 ink to put the top 2 cards of your deck into your inkwell facedown and exerted.", oncePerGame: false, art: "./assets/commanders/mufasa-ruler-of-pride-rock.jpg" },
  { id: "nick-wilde-wily-fox", name: "Nick Wilde", title: "Wily Fox", fullName: "Nick Wilde - Wily Fox", colors: ["sapphire"], ability: "You can have up to 4 copies of an item card named Pawpsicle in your deck. Once during your turn, you may banish 4 of your items. If you do, gain 4 lore.", oncePerGame: false, art: "./assets/commanders/nick-wilde-wily-fox.jpg" },
  { id: "snow-white-merry-as-the-morning", name: "Snow White", title: "Merry as the Morning", fullName: "Snow White - Merry as the Morning", colors: ["amethyst"], ability: "Once per game during your turn, you may reveal your hand. If you have a Snow White and 7 or more Seven Dwarfs character cards with different names among the cards in your hand, in your discard, and in play, this Coconut gains \"Your characters get +2 lore.\"", oncePerGame: true, art: "./assets/commanders/snow-white-merry-as-the-morning.jpg" },
  { id: "donald-duck-fred-honeywell", name: "Donald Duck", title: "Fred Honeywell", fullName: "Donald Duck - Fred Honeywell", colors: ["emerald"], ability: "You pay 1 ink less to use Boost abilities and to play characters or locations with Boost.", oncePerGame: false, art: "./assets/commanders/donald-duck-fred-honeywell.jpg" },
  { id: "mr-incredible-super-strong", name: "Mr. Incredible", title: "Super Strong", fullName: "Mr. Incredible - Super Strong", colors: ["ruby"], ability: "Whenever you play a Super character, they gain Rush this turn and you may exert chosen opposing character with less strength than them.", oncePerGame: false, art: "./assets/commanders/mr-incredible-super-strong.jpg" },
  { id: "moana-curious-explorer", name: "Moana", title: "Curious Explorer", fullName: "Moana - Curious Explorer", colors: ["sapphire"], ability: "During your turn, if you have a Moana, Heihei, or Pua character in play, you may ink an additional card.", oncePerGame: false, art: "./assets/commanders/moana-curious-explorer.jpg" },
  { id: "john-silver-greedy-treasure-seeker", name: "John Silver", title: "Greedy Treasure Seeker", fullName: "John Silver - Greedy Treasure Seeker", colors: ["steel"], ability: "Each of your locations gains Resist +1 for each character there.", oncePerGame: false, art: "./assets/commanders/john-silver-greedy-treasure-seeker.jpg" },
  { id: "robin-hood-sneaky-sleuth", name: "Robin Hood", title: "Sneaky Sleuth", fullName: "Robin Hood - Sneaky Sleuth", colors: ["emerald"], ability: "At the start of your first turn, you may play an item card named Robin's Bow from your collection for free. Whenever you play a character named Robin Hood, deal 1 damage to chosen opposing character or location.", oncePerGame: false, art: "./assets/commanders/robin-hood-sneaky-sleuth.jpg" },
  { id: "tinker-bell-giant-fairy", name: "Tinker Bell", title: "Giant Fairy", fullName: "Tinker Bell - Giant Fairy", colors: ["steel"], ability: "Whenever one of your other abilities or actions deals damage to an opposing character, deal 1 damage to that character.", oncePerGame: false, art: "./assets/commanders/tinker-bell-giant-fairy.jpg" },
  { id: "sisu-emboldened-warrior", name: "Sisu", title: "Emboldened Warrior", fullName: "Sisu - Emboldened Warrior", colors: ["ruby"], ability: "All characters with more strength than each opposing character can quest the turn they're played.", oncePerGame: false, art: "./assets/commanders/sisu-emboldened-warrior.jpg" },
  { id: "pocahontas-peacekeeper", name: "Pocahontas", title: "Peacekeeper", fullName: "Pocahontas - Peacekeeper", colors: ["amber"], ability: "Once during your turn, you may choose a character. Until the start of your next turn, they get +1 lore and can't challenge and must quest if able.", oncePerGame: false, art: "./assets/commanders/pocahontas-peacekeeper.jpg" },
  { id: "dumbo-ninth-wonder-of-the-universe", name: "Dumbo", title: "Ninth Wonder of the Universe", fullName: "Dumbo - Ninth Wonder of the Universe", colors: ["amethyst"], ability: "You may use the exert abilities of your characters the turn they're played.", oncePerGame: false, art: "./assets/commanders/dumbo-ninth-wonder-of-the-universe.jpg" },
  { id: "woody-and-buzz-lightyear-best-buddies", name: "Woody & Buzz Lightyear", title: "Best Buddies", fullName: "Woody & Buzz Lightyear - Best Buddies", colors: ["amber", "emerald"], ability: "Once during your turn, you may pay 1 ink less for the next Toy character you play this turn. If you do and you have a character named Woody and a character named Buzz Lightyear in play, draw a card.", oncePerGame: false, art: "./assets/commanders/woody-and-buzz-lightyear-best-buddies.jpg" },
  { id: "belle-and-beast-certain-as-the-sun", name: "Belle & Beast", title: "Certain as the Sun", fullName: "Belle & Beast - Certain as the Sun", colors: ["ruby", "sapphire"], ability: "Whenever one of your characters with cost 5 or more readies, draw a card.", oncePerGame: false, art: "./assets/commanders/belle-and-beast-certain-as-the-sun.jpg" },
  { id: "peter-pan-and-tinker-bell-fast-friends", name: "Peter Pan & Tinker Bell", title: "Fast Friends", fullName: "Peter Pan & Tinker Bell - Fast Friends", colors: ["amethyst", "ruby"], ability: "Once during your turn, you may give chosen character Evasive until the start of your next turn. If they already had Evasive, they get +1 lore until the start of your next turn.", oncePerGame: false, art: "./assets/commanders/peter-pan-and-tinker-bell-fast-friends.jpg" },
  { id: "the-madrigal-family-every-generation", name: "The Madrigal Family", title: "Every Generation", fullName: "The Madrigal Family - Every Generation", colors: ["amber", "sapphire"], ability: "During your turn, whenever you remove 1 or more damage from one of your characters, you may ready them. If you do, they can't quest or challenge for the rest of this turn.", oncePerGame: false, art: "./assets/commanders/the-madrigal-family-every-generation.jpg" },
  { id: "aladdin-and-genie-mischievous-pals", name: "Aladdin & Genie", title: "Mischievous Pals", fullName: "Aladdin & Genie - Mischievous Pals", colors: ["amethyst", "emerald"], ability: "Whenever you draw a card during your turn, if it's the third card you drew this turn, gain 2 lore.", oncePerGame: false, art: "./assets/commanders/aladdin-and-genie-mischievous-pals.jpg" },
  { id: "the-vine-towering-stalk", name: "The Vine", title: "Towering Stalk", fullName: "The Vine - Towering Stalk", colors: ["steel"], ability: "Once during your turn, for each Floodborn character you have in play, you may pay 1 ink less for the next Floodborn character you play this turn.", oncePerGame: false, art: "./assets/commanders/the-vine-towering-stalk.jpg" },
  { id: "darkwing-duck-and-launchpad-st-canard-s-finest", name: "Darkwing Duck & Launchpad", title: "St. Canard's Finest", fullName: "Darkwing Duck & Launchpad - St. Canard's Finest", colors: ["sapphire", "steel"], ability: "During your turn, whenever an opposing character is banished in a challenge, gain 1 lore. If they were a Villain character, gain 3 lore instead.", oncePerGame: false, art: "./assets/commanders/darkwing-duck-and-launchpad-st-canard-s-finest.jpg" }
];

const DEFAULT_COMMANDERS = [
  "ariel-spectacular-singer",
  "scar-finally-king",
  "mickey-mouse-brave-little-tailor",
  "moana-curious-explorer"
];

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
  format: "core",
  setupComplete: false,
  playerCount: 2,
  names: ["", "", "", ""],
  inks: ["amethyst", "steel", "ruby", "sapphire"],
  commanders: [...DEFAULT_COMMANDERS],
  oncePerGameUsed: [false, false, false, false],
  matchType: 1,
  timerDuration: DEFAULT_TIMER_SECONDS,
  scores: [0, 0, 0, 0],
  gameWins: [0, 0, 0, 0],
  gameResults: [],
  startingPlayer: null,
  showStartingPlayer: false,
  awaitingStartConfirm: false,
  timer: {
    remaining: DEFAULT_TIMER_SECONDS,
    running: false,
    startedAt: null,
    timeCalled: false
  },
  overtime: {
    active: false,
    remainingTurns: OVERTIME_TURNS,
    noticeShown: false
  },
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
const landingContinue = document.querySelector("#landing-continue");
const setupScreen = document.querySelector("#setup-screen");
const scoreScreen = document.querySelector("#score-screen");
const setupForm = document.querySelector("#setup-form");
const setupPlayerEls = [...document.querySelectorAll("[data-setup-player]")];
const playerEls = [0, 1, 2, 3].map((index) => document.querySelector(`.player[data-player="${index}"]`));
const setupNameEls = [0, 1, 2, 3].map((index) => document.querySelector(`#setup-name-${index}`));
const setupCommanderEls = [0, 1, 2, 3].map((index) => document.querySelector(`#setup-commander-${index}`));
const setupCommanderButtonEls = [0, 1, 2, 3].map((index) => document.querySelector(`#setup-commander-button-${index}`));
const scoreEls = [0, 1, 2, 3].map((index) => document.querySelector(`#score-${index}`));
const nameEls = [0, 1, 2, 3].map((index) => document.querySelector(`#name-${index}`));
const playerInkEls = [0, 1, 2, 3].map((index) => document.querySelector(`#player-ink-${index}`));
const commanderNameEls = [0, 1, 2, 3].map((index) => document.querySelector(`#commander-name-${index}`));
const commanderOnceEls = [0, 1, 2, 3].map((index) => document.querySelector(`#commander-once-${index}`));
const raceNameEls = [0, 1, 2, 3].map((index) => document.querySelector(`#race-name-${index}`));
const raceLaneEls = [0, 1, 2, 3].map((index) => document.querySelector(`.race-lane[data-player="${index}"]`));
const raceProgressEls = [0, 1, 2, 3].map((index) => document.querySelector(`#race-progress-${index}`));
const raceMarkerEls = [0, 1, 2, 3].map((index) => document.querySelector(`#race-marker-${index}`));
const raceStrip = document.querySelector(".race-strip");
const overtimeStrip = document.querySelector("#overtime-strip");
const overtimeTitle = document.querySelector("#overtime-title");
const overtimeCopy = document.querySelector("#overtime-copy");
const overtimePips = document.querySelector("#overtime-pips");
const statusTextEls = [document.querySelector("#status-text-away"), document.querySelector("#status-text-home")];
const matchScore = document.querySelector("#match-score");
const matchNameEls = [0, 1, 2, 3].map((index) => document.querySelector(`#match-name-${index}`));
const gameWinEls = [0, 1, 2, 3].map((index) => document.querySelector(`#game-wins-${index}`));
const startingPlayerEl = document.querySelector("#starting-player");
const roundTimer = document.querySelector("#round-timer");
const timerLabel = document.querySelector("#timer-label");
const timerDisplay = document.querySelector("#timer-display");
const timerToggle = document.querySelector("#timer-toggle");
const historyList = document.querySelector("#history-list");
const matchWinnerDialog = document.querySelector("#match-winner-dialog");
const matchWinnerTitle = document.querySelector("#match-winner-title");
const matchOverview = document.querySelector("#match-overview");
const matchTypeDialog = document.querySelector("#match-type-dialog");
const setupConfirmDialog = document.querySelector("#setup-confirm-dialog");
const commanderPickerDialog = document.querySelector("#commander-picker-dialog");
const commanderPickerLabel = document.querySelector("#commander-picker-label");
const commanderGrid = document.querySelector("#commander-grid");
const commanderAbilityDialog = document.querySelector("#commander-ability-dialog");
const commanderAbilityPlayer = document.querySelector("#commander-ability-player");
const commanderAbilityArt = document.querySelector("#commander-ability-art");
const commanderAbilityTitle = document.querySelector("#commander-ability-title");
const commanderAbilityText = document.querySelector("#commander-ability-text");
const startingPlayerDialog = document.querySelector("#starting-player-dialog");
const timeCalledDialog = document.querySelector("#time-called-dialog");
const startingPlayerTitle = document.querySelector("#starting-player-title");
const startingPlayerStart = document.querySelector("#starting-player-start");
let timerInterval = null;
let startingDialogTimer = null;
let commanderPickerPlayer = 0;

populateCommanderSelects();

if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

const selectedBackground = BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
landingBg.style.backgroundImage = `url("${selectedBackground}")`;
landingScreen.dataset.backgroundCount = String(BACKGROUND_IMAGES.length);
landingScreen.dataset.backgroundFile = selectedBackground.split("/").pop();

setResponsiveViewport();
window.addEventListener("resize", setResponsiveViewport);
window.visualViewport?.addEventListener("resize", setResponsiveViewport);

landingStart.addEventListener("click", () => {
  landingComplete = true;
  requestImmersiveMode();
  showSetupFromLanding();
});

landingContinue.addEventListener("click", () => {
  landingComplete = true;
  requestImmersiveMode();
  render();
});

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  requestImmersiveMode();
  startMatchFromSetup();
});

setupNameEls.forEach((input, index) => {
  input.addEventListener("input", () => {
    state.names[index] = input.value;
  });
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
  if (event.target?.name === "format") {
    state.format = event.target.value === "coconut" ? "coconut" : "core";
    if (isCoconut()) {
      state.matchType = 1;
      state.timerDuration = 0;
    }
    render();
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
  if (action === "requestSetup") openDialog(setupConfirmDialog);
  if (action === "resetCoconutGame") resetCurrentGame();
  if (action === "toggleTimer") toggleTimer();
  if (action === "overtimeTurn") completeOvertimeTurn();
  if (action === "overtimeUndo") undoOvertimeTurn();
  if (action === "openCommanderPicker") openCommanderPicker(Number(button.dataset.player));
  if (action === "chooseCommander") chooseCommander(button.dataset.commander);
  if (action === "showAbility") showCommanderAbility(Number(button.dataset.player));
  if (action === "toggleOnce") toggleOncePerGame(Number(button.dataset.player));
});

matchWinnerDialog.addEventListener("close", () => {
  if (matchWinnerDialog.returnValue === "back") {
    backToGameAfterMatchWin();
  }
  if (matchWinnerDialog.returnValue === "setup") {
    showSetup();
  }
  if (matchWinnerDialog.returnValue === "new-match") {
    if (isCoconut()) startNewMatch(1);
    else openDialog(matchTypeDialog);
  }
});

matchTypeDialog.addEventListener("close", () => {
  if (["1", "3", "5"].includes(matchTypeDialog.returnValue)) {
    startNewMatch(Number(matchTypeDialog.returnValue));
  }
});

setupConfirmDialog.addEventListener("close", () => {
  if (setupConfirmDialog.returnValue === "setup") {
    showSetup();
  }
});

startingPlayerDialog.addEventListener("close", () => {
  if (startingPlayerDialog.returnValue === "start-game") {
    confirmStartingPlayer();
  }
});

timeCalledDialog.addEventListener("close", () => {
  if (!state.timer.timeCalled) return;
  state.overtime = {
    ...normalizeOvertime(state.overtime),
    active: true,
    noticeShown: true
  };
  state.notice = overtimeStatusText();
  saveAndRender();
});

render();

function startMatchFromSetup() {
  syncSetupDraftNames();
  state.playerCount = Number(getCheckedValue("player-count")) || 2;
  state.format = getCheckedValue("format") === "coconut" ? "coconut" : "core";
  state.names = setupNameEls.map((input, index) => input.value.trim() || `Player ${index + 1}`);
  state.inks = [0, 1, 2, 3].map((index) => getCheckedValue(`ink-${index}`));
  state.commanders = setupCommanderEls.map((select, index) => normalizeCommanderId(select?.value, index));
  state.matchType = isCoconut() ? 1 : Number(getCheckedValue("match-type"));
  state.timerDuration = isCoconut() ? 0 : normalizeTimerDuration(getCheckedValue("timer-duration"));
  state.setupComplete = true;
  resetMatchState();
  saveAndRender();
}

function startNewMatch(matchType) {
  state.matchType = isCoconut() ? 1 : matchType;
  state.setupComplete = true;
  resetMatchState();
  saveAndRender();
}

function showSetupFromLanding() {
  state.setupComplete = false;
  state.names = ["", "", "", ""];
  state.matchLocked = false;
  state.matchWinner = null;
  state.notice = "";
  state.awaitingStartConfirm = false;
  state.showStartingPlayer = false;
  pauseTimer();
  saveAndRender();
}

function resetMatchState() {
  state.scores = [0, 0, 0, 0];
  state.gameWins = [0, 0, 0, 0];
  state.gameResults = [];
  state.startingPlayer = chooseStartingPlayer();
  state.showStartingPlayer = true;
  state.awaitingStartConfirm = true;
  resetTimer();
  state.history = [];
  state.notice = "";
  state.matchLocked = false;
  state.matchWinner = null;
  state.overtime = structuredClone(defaultState.overtime);
  state.oncePerGameUsed = [false, false, false, false];
}

function showSetup() {
  state.setupComplete = false;
  state.matchLocked = false;
  state.matchWinner = null;
  state.notice = "";
  state.awaitingStartConfirm = false;
  state.showStartingPlayer = false;
  pauseTimer();
  saveAndRender();
}

function resetCurrentGame() {
  if (!isCoconut()) return;
  state.scores = [0, 0, 0, 0];
  state.oncePerGameUsed = [false, false, false, false];
  state.history = [];
  state.notice = "";
  state.matchLocked = false;
  state.matchWinner = null;
  state.startingPlayer = chooseStartingPlayer();
  state.showStartingPlayer = true;
  state.awaitingStartConfirm = true;
  resetTimer();
  saveAndRender();
}

function changeScore(player, delta) {
  if (state.matchLocked || !isActivePlayer(player)) return;
  if (state.awaitingStartConfirm) {
    showStartingPlayerDialog();
    return;
  }

  state.notice = "";
  state.showStartingPlayer = false;
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

  if (previous[player] < targetLore() && nextScore >= targetLore()) {
    finishGame(player);
  }

  state.history = state.history.slice(0, 24);
  saveAndRender();
}

function finishGame(player) {
  state.gameWins[player] += 1;
  state.gameResults.push(player);
  const needed = winsNeeded();
  const gameWins = [...state.gameWins];
  const gameNumber = state.gameResults.length;

  state.history.unshift({
    type: "game",
    player,
    playerName: state.names[player],
    gameNumber,
    gameWins,
    matchType: state.matchType,
    at: new Date().toISOString()
  });

  if (state.gameWins[player] >= needed) {
    state.matchLocked = true;
    state.matchWinner = player;
    state.notice = `${state.names[player]} wins the match.`;
    pauseTimer();
    window.setTimeout(() => {
      matchWinnerTitle.textContent = `${state.names[player]} wins the match`;
      renderMatchOverview();
      openDialog(matchWinnerDialog);
    }, 120);
    return;
  }

  state.notice = `${state.names[player]} wins this game. Next game started.`;
  state.scores = [0, 0, 0, 0];
}

function backToGameAfterMatchWin() {
  const winner = state.matchWinner;
  if (Number.isInteger(winner)) {
    state.gameWins[winner] = Math.max(0, state.gameWins[winner] - 1);
    if (state.gameResults[state.gameResults.length - 1] === winner) {
      state.gameResults.pop();
    }
    if (state.history[0]?.type === "game" && state.history[0].player === winner) {
      state.history.shift();
    }
  }
  state.matchLocked = false;
  state.matchWinner = null;
  state.notice = "Back to game. Adjust the lore if needed.";
  saveAndRender();
}

function clearHistory() {
  state.history = [];
  saveAndRender();
}

function render() {
  landingScreen.classList.toggle("hidden", landingComplete);
  landingContinue.classList.toggle("hidden", !state.setupComplete);
  setupScreen.classList.toggle("hidden", !landingComplete || state.setupComplete);
  scoreScreen.classList.toggle("hidden", !landingComplete || !state.setupComplete);
  document.body.dataset.playerCount = String(state.playerCount);
  document.body.dataset.format = state.format;
  scoreScreen.dataset.format = state.format;
  scoreScreen.classList.remove("player-count-2", "player-count-3", "player-count-4");
  scoreScreen.classList.add(`player-count-${state.playerCount}`);

  setupNameEls.forEach((input, index) => {
    if (document.activeElement !== input) input.value = state.names[index];
  });
  renderSetupVisibility();
  setRadio("format", state.format);
  setRadio("player-count", String(state.playerCount));
  setRadio("ink-0", state.inks[0]);
  setRadio("ink-1", state.inks[1]);
  setRadio("ink-2", state.inks[2]);
  setRadio("ink-3", state.inks[3]);
  setRadio("match-type", String(state.matchType));
  setRadio("timer-duration", String(normalizeTimerDuration(state.timerDuration)));
  setupCommanderEls.forEach((select, index) => {
    if (select && document.activeElement !== select) select.value = normalizeCommanderId(state.commanders[index], index);
  });
  setupCommanderButtonEls.forEach((button, index) => {
    if (!button) return;
    const commander = getCommander(index);
    button.innerHTML = `
      <span class="commander-picker-icon">${commanderInkImage(commander)}</span>
      <span class="commander-picker-copy">
        <strong>${escapeHtml(commander.name)}</strong>
        <small>${escapeHtml(commander.title)}</small>
      </span>`;
  });

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
    const commander = getCommander(index);
    const accentColor = playerAccentColor(index);
    const identityImage = isCoconut() ? commanderInkImage(commander) : inkImage(ink, `${ink.name} ink`);
    playerEls[index].style.setProperty("--seat-color", accentColor);
    playerEls[index].style.setProperty("--commander-art", `url("${commander.art}")`);
    playerEls[index].style.setProperty("--commander-color", accentColor);
    nameEls[index].textContent = name;
    commanderNameEls[index].textContent = isCoconut() ? commander.fullName : "";
    playerInkEls[index].innerHTML = identityImage;
    playerInkEls[index].style.setProperty("--ink-color", accentColor);
    commanderOnceEls[index].classList.toggle("hidden", !isCoconut() || !commander.oncePerGame);
    commanderOnceEls[index].classList.toggle("used", Boolean(state.oncePerGameUsed[index]));
    commanderOnceEls[index].textContent = state.oncePerGameUsed[index] ? "Ability Used" : "Ability Available";
    raceNameEls[index].innerHTML = `${identityImage} ${escapeHtml(name)}`;
    raceLaneEls[index].style.setProperty("--ink-color", accentColor);
    raceLaneEls[index].dataset.active = String(isActivePlayer(index));
    matchNameEls[index].innerHTML = `${identityImage} ${escapeHtml(name)}`;
    matchNameEls[index].closest("[data-player]").dataset.active = String(isActivePlayer(index));
    gameWinEls[index].textContent = state.gameWins[index];
  });

  matchScore.classList.toggle("hidden", state.matchType === 1 || isCoconut());
  renderStartingPlayer();
  renderTimer();
  renderOvertime();
  renderStatus();
  renderHistory();
  renderMatchWinnerDialog();
}

function renderStatus() {
  const goal = targetLore();
  const active = activePlayers();
  const highest = Math.max(...active.map((index) => state.scores[index]));
  const leaders = active.filter((index) => state.scores[index] === highest);
  const leaderIndex = leaders.length === 1 ? leaders[0] : -1;

  if (state.notice) {
    setStatusText(state.notice);
  } else if (state.timer.timeCalled) {
    setStatusText(overtimeStatusText());
  } else if (highest >= goal) {
    setStatusText(leaderIndex === -1
      ? `All tied players reached ${goal} lore.`
      : `${state.names[leaderIndex]} reached ${goal} lore.`);
  } else if (leaderIndex === -1) {
    setStatusText(highest === 0 ? `Ready for ${matchLabel()}.` : `Tied at ${highest}.`);
  } else {
    const needed = goal - state.scores[leaderIndex];
    const runnerUp = Math.max(...active.filter((index) => index !== leaderIndex).map((index) => state.scores[index]));
    setStatusText(`${state.names[leaderIndex]} leads by ${state.scores[leaderIndex] - runnerUp}. ${needed} lore to go.`);
  }

  state.scores.forEach((score, index) => {
    const progress = `${clamp(score, 0, goal) / goal * 100}%`;
    raceProgressEls[index].style.setProperty("--race-progress", progress);
    raceMarkerEls[index].style.setProperty("--race-progress", progress);
    raceMarkerEls[index].style.setProperty("--ink-color", playerAccentColor(index));
    raceMarkerEls[index].textContent = score;
  });
}

function setStatusText(text) {
  statusTextEls.forEach((element) => {
    element.textContent = text;
  });
}

function toggleTimer() {
  if (!hasTimer()) return;
  if (state.awaitingStartConfirm) {
    showStartingPlayerDialog();
    return;
  }
  if (state.timer.running) pauseTimer();
  else startTimer();
  saveAndRender();
}

function startTimer() {
  if (!hasTimer()) {
    resetTimer();
    return;
  }
  const remaining = getTimerRemaining();
  const duration = timerDuration();
  state.timer = {
    remaining: remaining > 0 ? remaining : duration,
    running: true,
    startedAt: Date.now(),
    timeCalled: false
  };
  state.overtime = structuredClone(defaultState.overtime);
  ensureTimerInterval();
}

function pauseTimer() {
  const duration = timerDuration();
  state.timer = {
    ...normalizeTimer(state.timer, duration),
    remaining: getTimerRemaining(),
    running: false,
    startedAt: null
  };
  stopTimerInterval();
}

function resetTimer() {
  const duration = timerDuration();
  state.timer = {
    remaining: duration,
    running: false,
    startedAt: null,
    timeCalled: false
  };
  state.overtime = structuredClone(defaultState.overtime);
  stopTimerInterval();
}

function getTimerRemaining() {
  const duration = timerDuration();
  const timer = normalizeTimer(state.timer, duration);
  if (!timer.running || !timer.startedAt) return timer.remaining;
  const elapsed = Math.floor((Date.now() - Number(timer.startedAt)) / 1000);
  return clamp(timer.remaining - elapsed, 0, duration);
}

function renderTimer() {
  roundTimer.classList.toggle("timer-disabled", !hasTimer());
  if (!hasTimer()) {
    roundTimer.style.setProperty("--timer-progress", "0%");
    timerLabel.textContent = "";
    timerDisplay.textContent = "";
    timerToggle.textContent = "";
    timerToggle.disabled = true;
    timerToggle.classList.remove("running", "expired");
    stopTimerInterval();
    return;
  }
  timerToggle.disabled = false;
  const remaining = getTimerRemaining();
  const duration = timerDuration();
  const progress = duration ? remaining / duration * 100 : 0;
  roundTimer.style.setProperty("--timer-progress", `${progress}%`);
  timerLabel.textContent = `${matchLabel().toUpperCase()} round`;
  timerDisplay.textContent = formatTime(remaining);
  timerToggle.textContent = state.timer.running ? "Pause" : remaining <= 0 ? "Restart" : "Start";
  timerToggle.classList.toggle("running", state.timer.running);
  timerToggle.classList.toggle("expired", remaining <= 0);

  if (state.timer.running && remaining <= 0) {
    state.timer = {
      ...normalizeTimer(state.timer, duration),
      remaining: 0,
      running: false,
      startedAt: null,
      timeCalled: true
    };
    state.overtime = {
      active: true,
      remainingTurns: OVERTIME_TURNS,
      noticeShown: false
    };
    state.notice = overtimeStatusText();
    stopTimerInterval();
    saveAndRender();
    return;
  }

  if (state.timer.running) ensureTimerInterval();
  else stopTimerInterval();

  if (state.timer.timeCalled && !state.overtime?.noticeShown && !timeCalledDialog.open) {
    window.setTimeout(() => {
      if (state.timer.timeCalled && !state.overtime?.noticeShown && !timeCalledDialog.open) {
        openDialog(timeCalledDialog);
      }
    }, 80);
  }
}

function renderOvertime() {
  const overtime = normalizeOvertime(state.overtime);
  const visible = !isCoconut() && (state.timer.timeCalled || overtime.active);
  raceStrip.classList.toggle("hidden", visible);
  overtimeStrip.classList.toggle("hidden", !visible);
  if (!visible) return;

  const remaining = clamp(overtime.remainingTurns, 0, OVERTIME_TURNS);
  overtimeTitle.textContent = remaining === 0 ? "Overtime complete" : `${remaining} turn${remaining === 1 ? "" : "s"} remaining`;
  overtimeCopy.textContent = remaining === 0
    ? "If no player has won, the game is a draw."
    : "Press Turn complete after each additional turn finishes.";
  overtimePips.innerHTML = Array.from({ length: OVERTIME_TURNS }, (_, index) => {
    const spent = index < OVERTIME_TURNS - remaining ? " spent" : "";
    return `<span class="overtime-pip${spent}">${OVERTIME_TURNS - index}</span>`;
  }).join("");
}

function completeOvertimeTurn() {
  if (!state.timer.timeCalled) return;
  const overtime = normalizeOvertime(state.overtime);
  if (overtime.remainingTurns <= 0) return;
  state.overtime = {
    ...overtime,
    active: true,
    remainingTurns: overtime.remainingTurns - 1,
    noticeShown: true
  };
  state.notice = overtimeStatusText();
  state.history.unshift({
    type: "overtime",
    remainingTurns: state.overtime.remainingTurns,
    at: new Date().toISOString()
  });
  state.history = state.history.slice(0, 24);
  saveAndRender();
}

function undoOvertimeTurn() {
  if (!state.timer.timeCalled) return;
  const overtime = normalizeOvertime(state.overtime);
  if (overtime.remainingTurns >= OVERTIME_TURNS) return;
  state.overtime = {
    ...overtime,
    active: true,
    remainingTurns: overtime.remainingTurns + 1,
    noticeShown: true
  };
  state.notice = overtimeStatusText();
  saveAndRender();
}

function overtimeStatusText() {
  const overtime = normalizeOvertime(state.overtime);
  if (overtime.remainingTurns <= 0) return "Overtime complete. If nobody won, the game is a draw.";
  return `Time called. ${overtime.remainingTurns} additional turn${overtime.remainingTurns === 1 ? "" : "s"} remaining.`;
}

function renderStartingPlayer() {
  const player = state.startingPlayer;
  const visible = state.showStartingPlayer && isActivePlayer(player);
  startingPlayerEl.classList.toggle("hidden", !visible);
  if (!visible) {
    clearStartingDialogTimer();
    return;
  }
  const players = activePlayers();
  const selectedPosition = Math.max(0, players.indexOf(player));
  const playerAngle = players.length ? selectedPosition * (360 / players.length) : 0;
  const spinAngle = 1440 + playerAngle;
  startingPlayerEl.style.setProperty("--ink-color", playerAccentColor(player));
  startingPlayerEl.style.setProperty("--spin-angle", `${spinAngle}deg`);
  startingPlayerEl.innerHTML = `
    <div class="starter-wheel" data-count="${players.length}">
      <span class="starter-pointer" aria-hidden="true"><i></i></span>
      ${players.map((playerIndex, position) => {
        const playerInk = getInk(playerIndex);
        const commander = getCommander(playerIndex);
        const chipImage = isCoconut() ? commanderInkImage(commander) : inkImage(playerInk, `${playerInk.name} ink`);
        const angle = position * (360 / players.length);
        const selected = playerIndex === player ? " selected" : "";
        return `<span class="starter-chip${selected}" style="--chip-angle: ${angle}deg; --chip-color: ${playerAccentColor(playerIndex)};">
          ${chipImage}
        </span>`;
      }).join("")}
    </div>
    <span class="starter-result">
      <small>Starts</small>
      <strong>${escapeHtml(state.names[player])}</strong>
    </span>`;
  if (state.awaitingStartConfirm) {
    showStartingPlayerDialog();
  }
}

function showStartingPlayerDialog() {
  if (!state.awaitingStartConfirm || !isActivePlayer(state.startingPlayer)) return;
  if (startingPlayerDialog.open) return;
  clearStartingDialogTimer();
  startingPlayerTitle.textContent = "Choosing starting player";
  startingPlayerStart.disabled = true;
  startingPlayerDialog.classList.add("is-resolving");
  openDialog(startingPlayerDialog);
  startingDialogTimer = window.setTimeout(() => {
    startingDialogTimer = null;
    if (!state.awaitingStartConfirm) return;
    startingPlayerTitle.textContent = `${state.names[state.startingPlayer]} is the starting player`;
    startingPlayerStart.disabled = false;
    startingPlayerDialog.classList.remove("is-resolving");
  }, 2500);
}

function clearStartingDialogTimer() {
  if (!startingDialogTimer) return;
  window.clearTimeout(startingDialogTimer);
  startingDialogTimer = null;
}

function confirmStartingPlayer() {
  if (!state.awaitingStartConfirm) return;
  state.awaitingStartConfirm = false;
  state.showStartingPlayer = false;
  state.notice = "";
  if (hasTimer()) startTimer();
  else resetTimer();
  saveAndRender();
}

function ensureTimerInterval() {
  if (timerInterval) return;
  timerInterval = window.setInterval(() => {
    render();
    if (getTimerRemaining() <= 0) saveAndRender();
  }, 1000);
}

function stopTimerInterval() {
  if (!timerInterval) return;
  window.clearInterval(timerInterval);
  timerInterval = null;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function normalizeTimer(timer, duration = DEFAULT_TIMER_SECONDS) {
  const normalizedDuration = normalizeTimerDuration(duration);
  return {
    ...defaultState.timer,
    ...(timer || {}),
    remaining: Number.isFinite(Number(timer?.remaining))
      ? clamp(Number(timer.remaining), 0, normalizedDuration)
      : normalizedDuration
  };
}

function normalizeOvertime(overtime) {
  return {
    ...defaultState.overtime,
    ...(overtime || {}),
    remainingTurns: clamp(Number.isFinite(Number(overtime?.remainingTurns))
      ? Number(overtime.remainingTurns)
      : OVERTIME_TURNS, 0, OVERTIME_TURNS),
    active: Boolean(overtime?.active),
    noticeShown: Boolean(overtime?.noticeShown)
  };
}

function timerDuration() {
  if (isCoconut()) return 0;
  return normalizeTimerDuration(state.timerDuration);
}

function hasTimer() {
  return !isCoconut() && timerDuration() > 0;
}

function normalizeTimerDuration(value) {
  const duration = Number(value);
  return TIMER_OPTIONS.includes(duration) ? duration : DEFAULT_TIMER_SECONDS;
}

function renderMatchWinnerDialog() {
  if (!state.matchLocked || !Number.isInteger(state.matchWinner) || matchWinnerDialog.open) return;
  window.setTimeout(() => {
    if (!state.matchLocked || matchWinnerDialog.open) return;
    matchWinnerTitle.textContent = `${state.names[state.matchWinner]} wins the match`;
    renderMatchOverview();
    openDialog(matchWinnerDialog);
  }, 120);
}

function renderMatchOverview() {
  const results = Array.isArray(state.gameResults) ? state.gameResults : [];
  matchOverview.classList.toggle("hidden", results.length === 0 || state.matchType === 1 || isCoconut());
  matchOverview.innerHTML = results.map((player, index) =>
    `<li><span>G${index + 1}</span><strong>${escapeHtml(state.names[player] || `Player ${player + 1}`)}</strong></li>`
  ).join("");
}

function renderHistory() {
  if (state.history.length === 0) {
    historyList.innerHTML = "<li><span>No actions yet.</span><span></span></li>";
    return;
  }

  historyList.innerHTML = state.history.slice(0, 8).map((item) => {
    if (item.type === "score") {
      const playerName = item.playerName || state.names[item.player] || "Player";
      const from = Number.isFinite(item.from) ? item.from : item.previous?.[item.player] ?? "?";
      const to = Number.isFinite(item.to) ? item.to : item.scores?.[item.player] ?? "?";
      return `<li><span><strong>${escapeHtml(playerName)}</strong> from ${from} to ${to} lore</span><span> Score ${formatScores(item.scores)}</span></li>`;
    }
    if (item.type === "game") {
      const playerName = item.playerName || state.names[item.player] || "Player";
      return `<li><span><strong>${escapeHtml(playerName)}</strong> wins game</span><span> Match ${formatScores(item.gameWins)}</span></li>`;
    }
    if (item.type === "overtime") {
      return `<li><span><strong>Overtime turn complete</strong></span><span>${item.remainingTurns} left</span></li>`;
    }
    return "<li><span>New game started</span><span> Score 0 - 0</span></li>";
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
  if (isCoconut()) return "Coconut";
  return `BO${state.matchType}`;
}

function getInk(index) {
  return INKS[state.inks[index]] || INKS.amber;
}

function getCommander(index) {
  return COCONUT_COMMANDERS.find((commander) => commander.id === state.commanders[index])
    || COCONUT_COMMANDERS.find((commander) => commander.id === DEFAULT_COMMANDERS[index])
    || COCONUT_COMMANDERS[0];
}

function normalizeCommanderId(value, index = 0) {
  if (COCONUT_COMMANDERS.some((commander) => commander.id === value)) return value;
  return DEFAULT_COMMANDERS[index] || COCONUT_COMMANDERS[0].id;
}

function commanderColor(index) {
  const commander = getCommander(index);
  const firstColor = commander.colors[0];
  return INKS[firstColor]?.color || INKS.amber.color;
}

function playerAccentColor(index) {
  return isCoconut() ? commanderColor(index) : getInk(index).color;
}

function commanderInkImage(commander) {
  return `<img src="${commander.art}" alt="${escapeHtml(commander.fullName)}">`;
}

function populateCommanderSelects() {
  setupCommanderEls.forEach((select) => {
    if (!select) return;
    select.innerHTML = COCONUT_COMMANDERS.map((commander) =>
      `<option value="${commander.id}">${escapeHtml(commander.fullName)}</option>`
    ).join("");
  });
  renderCommanderGrid();
}

function renderCommanderGrid() {
  if (!commanderGrid) return;
  const selectedId = normalizeCommanderId(state.commanders[commanderPickerPlayer], commanderPickerPlayer);
  commanderGrid.innerHTML = COCONUT_COMMANDERS.map((commander) => {
    const selected = commander.id === selectedId ? " selected" : "";
    return `<button class="commander-choice${selected}" data-action="chooseCommander" data-commander="${commander.id}" type="button">
      <span class="commander-choice-art">${commanderInkImage(commander)}</span>
      <span>${escapeHtml(commander.name)}</span>
      <small>${escapeHtml(commander.title)}</small>
    </button>`;
  }).join("");
}

function syncSetupDraftNames() {
  if (state.setupComplete) return;
  setupNameEls.forEach((input, index) => {
    state.names[index] = input.value;
  });
}

function openCommanderPicker(player) {
  if (!isActivePlayer(player)) return;
  syncSetupDraftNames();
  commanderPickerPlayer = player;
  commanderPickerLabel.textContent = `${state.names[player] || `Player ${player + 1}`} commander`;
  renderCommanderGrid();
  openDialog(commanderPickerDialog);
}

function chooseCommander(commanderId) {
  if (!isActivePlayer(commanderPickerPlayer)) return;
  syncSetupDraftNames();
  state.commanders[commanderPickerPlayer] = normalizeCommanderId(commanderId, commanderPickerPlayer);
  state.oncePerGameUsed[commanderPickerPlayer] = false;
  commanderPickerDialog.close?.();
  saveAndRender();
}

function showCommanderAbility(player) {
  if (!isCoconut() || !isActivePlayer(player)) return;
  const commander = getCommander(player);
  commanderAbilityPlayer.textContent = `${state.names[player] || `Player ${player + 1}`} commander`;
  commanderAbilityArt.innerHTML = commanderInkImage(commander);
  commanderAbilityTitle.textContent = commander.fullName;
  commanderAbilityText.textContent = commander.ability;
  openDialog(commanderAbilityDialog);
}

function toggleOncePerGame(player) {
  if (!isCoconut() || !isActivePlayer(player) || !getCommander(player).oncePerGame) return;
  state.oncePerGameUsed[player] = !state.oncePerGameUsed[player];
  saveAndRender();
}

function isCoconut() {
  return state.format === "coconut";
}

function targetLore() {
  return isCoconut() ? COCONUT_TARGET_LORE : CORE_TARGET_LORE;
}

function activePlayers() {
  return Array.from({ length: state.playerCount }, (_, index) => index);
}

function chooseStartingPlayer() {
  const players = activePlayers();
  return players[Math.floor(Math.random() * players.length)] ?? 0;
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

function setResponsiveViewport() {
  const viewport = window.visualViewport || window;
  const width = viewport.width || window.innerWidth || document.documentElement.clientWidth;
  const height = viewport.height || window.innerHeight || document.documentElement.clientHeight;
  const scale = clamp(Math.min(width / 390, height / 760), 0.72, 1);
  const compactScale = clamp(Math.min(width / 375, height / 680), 0.66, 1);
  const root = document.documentElement;

  root.style.setProperty("--app-width", `${width}px`);
  root.style.setProperty("--app-height", `${height}px`);
  root.style.setProperty("--device-scale", scale.toFixed(3));
  root.style.setProperty("--compact-scale", compactScale.toFixed(3));
  root.dataset.viewportHeight = height < 680 ? "tight" : height < 760 ? "compact" : "roomy";
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
    const format = saved.format === "coconut" ? "coconut" : "core";
    const savedTimerDuration = format === "coconut" ? 0 : normalizeTimerDuration(saved.timerDuration);
    const matchType = format === "coconut"
      ? 1
      : [1, 3, 5].includes(Number(saved.matchType)) ? Number(saved.matchType) : 1;
    return {
      ...structuredClone(defaultState),
      ...saved,
      format,
      playerCount: [2, 3, 4].includes(Number(saved.playerCount)) ? Number(saved.playerCount) : 2,
      timerDuration: savedTimerDuration,
      names: [0, 1, 2, 3].map((index) => saved.names?.[index] || defaultState.names[index]),
      inks: [0, 1, 2, 3].map((index) => saved.inks?.[index] || defaultState.inks[index]),
      commanders: [0, 1, 2, 3].map((index) => normalizeCommanderId(saved.commanders?.[index], index)),
      oncePerGameUsed: [0, 1, 2, 3].map((index) => Boolean(saved.oncePerGameUsed?.[index])),
      scores: [0, 1, 2, 3].map((index) => Number(saved.scores?.[index]) || 0),
      gameWins: [0, 1, 2, 3].map((index) => Number(saved.gameWins?.[index]) || 0),
      gameResults: Array.isArray(saved.gameResults) ? saved.gameResults.filter((player) => Number.isInteger(player)) : [],
      startingPlayer: Number.isInteger(saved.startingPlayer) ? saved.startingPlayer : null,
      showStartingPlayer: Boolean(saved.showStartingPlayer),
      awaitingStartConfirm: Boolean(saved.awaitingStartConfirm),
      timer: normalizeTimer(saved.timer, savedTimerDuration),
      overtime: normalizeOvertime(saved.overtime),
      matchType,
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
