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
  
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = `Player ${i} Name`;
        nameInput.required = true;
  
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
  
            playerDiv.style.backgroundColor = ink.color;
  
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
      validateForm();
    }
  
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
  
      const playerCount = parseInt(playerCountSelect.value);
      if (playerCount === 2) {
        location.href = "tracker-2p.html";
      } else if (playerCount === 3) {
        location.href = "tracker-3p.html";
      } else if (playerCount === 4) {
        location.href = "tracker-4p.html";
      }
    });
  
    playerCountSelect.addEventListener("change", updatePlayerInputs);
    updatePlayerInputs(); // Load defaults on page load
  });
  