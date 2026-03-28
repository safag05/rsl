function renderFixtures(data) {
    const container = document.getElementById('fixtures-container');
    
    if (!container) {
        console.error("Error: Could not find element with ID 'fixtures-container'");
        return;
    }

    let html = `<table class="fixtures-table"><tbody>`;

    if (data && data.weeks) {
        data.weeks.forEach(week => {
            const weekDisplayName = (week.week || "TBD WEEK").toUpperCase();

            // 1. THE WEEK HEADER (Now at the very top of the section)
            html += `
            <tr class="week-title-row">
                <th colspan="3">${weekDisplayName}</th>
            </tr>`;

            // 2. THE COLUMN TITLES (Moved here to be below the Week name)
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
        });
    }

    html += `</tbody></table>`;
    container.innerHTML = html;
}

// FETCH DATA
fetch('/data/fixtures.json')
    .then(response => {
        if (!response.ok) throw new Error("Could not load fixtures.json");
        return response.json();
    })
    .then(data => renderFixtures(data))
    .catch(error => {
        console.error("Error loading fixtures:", error);
        if(document.getElementById('fixtures-container')) {
            document.getElementById('fixtures-container').innerHTML = "<p>Error loading data.</p>";
        }
    });