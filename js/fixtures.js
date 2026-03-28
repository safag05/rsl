function renderFixtures(data) {
    let html = `
    <table>
        <tr>
            <th>🏟️ Home</th>
            <th>📅 Dates</th>
            <th>🚌 Away</th>
        </tr>`;

    data.weeks.forEach(week => {
        week.days.forEach(day => {
            // Add the Date Header Row
            html += `
            <tr>
                <th colspan="3">${day.dateHeader}</th>
            </tr>`;

            // Add each Game Row
            day.games.forEach(game => {
                const scoreDisplay = (game.homeScore === "TBD") 
                    ? "TBD" 
                    : `${game.homeScore} - ${game.awayScore}`;
                
                html += `
                <tr>
                    <td>${game.home}</td>
                    <td>${scoreDisplay}</td>
                    <td>${game.away}</td>
                </tr>`;
            });
        });
    });

    html += `</table>`;
    document.getElementById('fixtures-container').innerHTML = html;
}

// ADD THIS BELOW YOUR FUNCTION:
// Fetch the JSON file and execute the render function
fetch('/data/fixtures.json')
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    })
    .then(data => renderFixtures(data))
    .catch(error => console.error("Error loading fixtures:", error));