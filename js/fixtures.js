function renderFixtures(data) {
    const container = document.getElementById('fixtures-container');
    
    // Safety check: Make sure the container exists in your HTML
    if (!container) {
        console.error("Error: Could not find element with ID 'fixtures-container'");
        return;
    }

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

    // Ensure data.weeks exists before looping
    if (data && data.weeks) {
        data.weeks.forEach(week => {
            // Safety check: Use a fallback if week name is missing
            const weekDisplayName = (week.week || "TBD WEEK").toUpperCase();

            html += `
            <tr class="week-title-row">
                <th colspan="3">${weekDisplayName}</th>
            </tr>`;

            if (week.days) {
                week.days.forEach(day => {
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

// --- THE CRITICAL PART: FETCH THE DATA ---
// This must be at the bottom of your file
fetch('/data/fixtures.json')
    .then(response => {
        if (!response.ok) throw new Error("Could not load fixtures.json");
        return response.json();
    })
    .then(data => {
        renderFixtures(data);
    })
    .catch(error => {
        console.error("Error loading fixtures:", error);
        document.getElementById('fixtures-container').innerHTML = "<p>Error loading fixtures. Check console (F12).</p>";
    });