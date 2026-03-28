function renderFixtures(data) {
    const container = document.getElementById('fixtures-container');
    
    if (!container) {
        console.error("Error: Could not find element with ID 'fixtures-container'");
        return;
    }

    // Start with an empty string
    let html = '';

    if (data && data.weeks) {
        data.weeks.forEach(week => {
            const weekDisplayName = (week.week || "TBD WEEK").toUpperCase();

            // OPEN a new table for EACH week
            html += `<table class="fixtures-table"><tbody>`;

            // 1. THE WEEK HEADER
            html += `
            <tr class="week-title-row">
                <th colspan="3">${weekDisplayName}</th>
            </tr>`;

            // 2. THE COLUMN TITLES
            html += `
            <tr class="column-labels-row">
                <th>🏟️ Home</th>
                <th>📅 Dates</th>
                <th>🚌 Away</th>
            </tr>`;

            if (week.days) {
                week.days.forEach(day => {
                    // 3. THE DATE HEADER
                    html += `
                    <tr class="date-header-row">
                        <th colspan="3">${day.dateHeader || ''}</th>
                    </tr>`;

                    if (day.games) {
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
                    }
                });
            }

            // CLOSE the table for this week
            html += `</tbody></table>`;
            
            // Add spacing between the tables
            html += `<br><br>`; 
        });
    }

    container.innerHTML = html;
}