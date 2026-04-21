fetch('/data/fixtures.json')
  .then(res => res.json())
  .then(data => {
    renderFixtures(data);
  })
  .catch(error => console.error("Error loading fixtures:", error));

function renderFixtures(data) {
    let html = ''; 

    // --- RENDER REGULAR SEASON ---
    data.weeks.forEach(week => {
        html += `<div class="week-container">`;

        if (week.announcement) {
            html += `<section class="teams">${week.announcement}</section>`;
        }

        html += `
        <table class="fixtures-table">
            <thead>
                <tr class="week-title-row">
                    <th colspan="3">${week.week}</th>
                </tr>
                <tr>
                    <th style="background-color: #c5e1ed;">🏟️ Home</th>
                    <th style="background-color: #c5e1ed;">📅 Dates/Scores</th>
                    <th style="background-color: #c5e1ed;">🚌 Away</th>
                </tr>
            </thead>
            <tbody>`;

        week.days.forEach(day => {
            html += `
            <tr class="date-header-row">
                <th colspan="3">${day.dateHeader}</th>
            </tr>`;

            day.games.forEach(game => {
                let scoreDisplay = getScoreDisplay(game);
                let gameLabel = game.label ? `<br><span style="font-size: 0.8em; color: #d35400; font-weight: bold;">${game.label}</span>` : '';
                
                html += `
                <tr class="game-row">
                    <td>${game.home}</td>
                    <td class="score" style="text-align:center;">${scoreDisplay}${gameLabel}</td>
                    <td>${game.away}</td>
                </tr>`;
            });
        });

        html += `</tbody></table></div>`; 
    });

    // --- RENDER PLAYOFFS ---
    if (data.playoffs && data.playoffs.length > 0) {
        html += `<br><br><h2 style="text-align: center; color: #2c3e50; font-size: 2em;">🏆 PLAYOFFS 🏆</h2><br>`;

        data.playoffs.forEach(round => {
            html += `<div class="week-container">`;
            html += `
            <table class="fixtures-table">
                <thead>
                    <tr class="week-title-row">
                        <th colspan="3" style="background-color: #ffd700; color: #000;">${round.round}</th>
                    </tr>
                    <tr>
                        <th style="background-color: #f1c40f;">🏟️ Home</th>
                        <th style="background-color: #f1c40f;">📅 Dates/Scores</th>
                        <th style="background-color: #f1c40f;">🚌 Away</th>
                    </tr>
                </thead>
                <tbody>`;

            round.days.forEach(day => {
                // 1. ADD THIS PART: Check for the new date field
                if (day.date) {
                    html += `
                    <tr class="date-header-row">
                        <th colspan="3" style="background-color: #34495e; color: white; font-size: 0.85em;">📅 ${day.date}</th>
                    </tr>`;
                }

                // 2. This is your existing Division header (e.g., Division A Semifinals)
                html += `
                <tr class="date-header-row">
                    <th colspan="3" style="background-color: #ecf0f1; color: #2c3e50;">${day.dateHeader}</th>
                </tr>`;

                // ... rest of the games loop ...
            });

            html += `</tbody></table></div>`; 
        });
    }

    const container = document.getElementById('fixtures-container');
    if (container) {
        container.innerHTML = html;
    }
}

function getScoreDisplay(game) {
    const homeIsNumber = /^\d+$/.test(String(game.homeScore).trim());
    const awayIsNumber = /^\d+$/.test(String(game.awayScore).trim());

    if (game.homeScore === "BYE" || game.awayScore === "BYE") {
        return "<span class='bye-text'>BYE WEEK</span>";
    } else if (homeIsNumber && awayIsNumber) {
        return `<strong>${game.homeScore} - ${game.awayScore}</strong>`;
    } else if (game.homeScore !== "TBD" && game.homeScore !== "") {
        return game.homeScore;
    } else {
        return "TBD";
    }
}