function renderFixtures(data) {
    let html = ''; // Start with an empty string, not a <table> tag

    data.weeks.forEach(week => {
        // 1. Open a container for the week (This allows the 60px gap)
        html += `<div class="week-container">`;
        
        // 2. Add the Week Header (e.g., WEEK 1)
        html += `<h2 class="week-title">${week.week}</h2>`;

        // 3. Start a NEW table for this specific week
        html += `
        <table class="fixtures-table">
            <thead>
                <tr>
                    <th>🏟️ Home</th>
                    <th>📅 Dates</th>
                    <th>🚌 Away</th>
                </tr>
            </thead>
            <tbody>`;

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

        // 4. Close the table and the week container
        html += `</tbody></table>`;
        html += `</div>`; 
    });

    // Inject the final HTML into your container
    document.getElementById('fixtures-container').innerHTML = html;
}