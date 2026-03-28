function renderFixtures(data) {
    let html = `
    <table class="fixtures-table">
        <thead>
            <tr>
                <th>🏟️ Home</th>
                <th>📅 Dates</th>
                <th>🚌 Away</th>
            </tr>
        </thead>
        <tbody>`;

    data.weeks.forEach(week => {
        // --- NEW: Add the Week Number Header Row ---
        html += `
        <tr class="week-title-row">
            <th colspan="3">${week.week.toUpperCase()}</th>
        </tr>`;

        week.days.forEach(day => {
            // Add the Date Header Row
            html += `
            <tr class="date-header-row">
                <th colspan="3">${day.dateHeader}</th>
            </tr>`;

            // Add each Game Row
            day.games.forEach(game => {
                const scoreDisplay = (game.homeScore === "TBD") 
                    ? "TBD" 
                    : `${game.homeScore} - ${game.awayScore}`;
                
                html += `
                <tr class="game-row">
                    <td>${game.home}</td>
                    <td class="score">${scoreDisplay}</td>
                    <td>${game.away}</td>
                </tr>`;
            });
        });
    });

    html += `</tbody></table>`;
    document.getElementById('fixtures-container').innerHTML = html;
}