function renderFixtures(data) {
    const container = document.getElementById('fixtures-container');
    if (!container) return;

    let html = ''; // Start clean

    if (data && data.weeks) {
        data.weeks.forEach(week => {
            // OPEN the individual week container and table
            html += `<div class="week-container">`;
            html += `<table class="fixtures-table"><tbody>`;
            
            const weekDisplayName = (week.week || "TBD WEEK").toUpperCase();

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
                    // 3. THE DATE HEADER (e.g., Tuesday)
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
            // CLOSE the table and the div for THIS week
            html += `</tbody></table>`;
            html += `</div>`; 
        });
    }

    // Set the content
    container.innerHTML = html;
}