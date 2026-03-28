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
                const scoreDisplay = (game.homeScore === "0") 
                    ? "0" 
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