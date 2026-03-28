// 1. Fetch the data from your JSON file
fetch('/data/fixtures.json')
  .then(res => res.json())
  .then(data => {
    renderFixtures(data);
  })
  .catch(error => console.error("Error loading fixtures:", error));

// 2. The function that builds the HTML
function renderFixtures(data) {
    let html = ''; // Start with an empty string

    data.weeks.forEach(week => {
        // Start a new container to create the 60px gap from your CSS
        html += `<div class="week-container">`;

        // Start a NEW independent table for this specific week
        html += `
        <table class="fixtures-table">
            <thead>
                <tr class="week-title-row">
                    <th colspan="3">${week.week}</th>
                </tr>
                <tr>
                    <th style="background-color: #cdd9de;">🏟️ Home</th>
                    <th style="background-color: #cdd9de;">📅 Dates</th>
                    <th style="background-color: #cdd9de;">🚌 Away</th>
                </tr>
            </thead>
            <tbody>`;

        week.days.forEach(day => {
            // Add the Date Header
            html += `
            <tr class="date-header-row">
                <th colspan="3">${day.dateHeader}</th>
            </tr>`;

            // Add each Game
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

        // Close the table and the div container for this week
        html += `
            </tbody>
        </table>
        </div>`; 
    });

    // Inject the final HTML into your page
    const container = document.getElementById('fixtures-container');
    if (container) {
        container.innerHTML = html;
    } else {
        console.error("Could not find element with ID 'fixtures-container'");
    }
}