const checkInForm = document.querySelector("#checkInForm");
const attendeeName = document.querySelector("#attendeeName");
const teamSelect = document.querySelector("#teamSelect");
const attendeeCount = document.querySelector("#attendeeCount");
const progressBar = document.querySelector("#progressBar");
const greeting = document.querySelector("#greeting");
const celebration = document.querySelector("#celebration");
const attendeeList = document.querySelector("#attendeeList");
const teamCards = document.querySelectorAll(".team-card");

const maxGoal = 50;
const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};
const teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0,
};
const attendees = JSON.parse(localStorage.getItem("attendees")) || [];
let totalAttendees = Number(localStorage.getItem("totalAttendees")) || 0;

function updatePage() {
  const progressPercentage = (totalAttendees / maxGoal) * 100;
  const progressWidth = Math.min(progressPercentage, 100);

  attendeeCount.textContent = totalAttendees;
  progressBar.style.width = `${progressWidth}%`;

  document.querySelector("#waterCount").textContent = teamCounts.water;
  document.querySelector("#zeroCount").textContent = teamCounts.zero;
  document.querySelector("#powerCount").textContent = teamCounts.power;

  attendeeList.innerHTML = "";

  for (let index = 0; index < attendees.length; index = index + 1) {
    const attendeeItem = document.createElement("li");
    attendeeItem.textContent = `${attendees[index].name} - ${attendees[index].teamLabel}`;
    attendeeList.appendChild(attendeeItem);
  }

  for (let index = 0; index < teamCards.length; index = index + 1) {
    teamCards[index].classList.remove("winning-team");
  }

  if (totalAttendees >= maxGoal) {
    let winningTeam = "water";

    if (teamCounts.zero > teamCounts[winningTeam]) {
      winningTeam = "zero";
    }

    if (teamCounts.power > teamCounts[winningTeam]) {
      winningTeam = "power";
    }

    celebration.textContent = `Goal reached! ${teamLabels[winningTeam]} wins with the most check-ins!`;
    celebration.classList.add("celebration-message");
    celebration.style.display = "block";
    document.querySelector(`.team-card.${winningTeam}`).classList.add("winning-team");
  }
}

updatePage();

checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = attendeeName.value.trim();
  const team = teamSelect.value;
  const teamLabel = teamSelect.options[teamSelect.selectedIndex].text;

  totalAttendees = totalAttendees + 1;
  teamCounts[team] = teamCounts[team] + 1;
  attendees.push({ name: name, teamLabel: teamLabel });

  localStorage.setItem("totalAttendees", totalAttendees);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));

  updatePage();
  greeting.textContent = `Welcome, ${name}! You checked in with ${teamLabel}.`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  checkInForm.reset();
});
