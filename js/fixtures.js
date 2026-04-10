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

        // 👉 NEW CODE: Check for an announcement and add it here!
        if (week.announcement) {
            html += `
            <section class="teams">
                ${week.announcement}
            </section>`;
        }

        // Start a NEW independent table for this specific week
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
            // Add the Date Header
            html += `
            <tr class="date-header-row">
                <th colspan="3">${day.dateHeader}</th>
            </tr>`;

            // Add each Game
            day.games.forEach(game => {
                let scoreDisplay = "";
                
                // Check if BOTH score fields contain ONLY numbers
                const homeIsNumber = /^\d+$/.test(String(game.homeScore).trim());
                const awayIsNumber = /^\d+$/.test(String(game.awayScore).trim());

                // 1. Check for BYE week first
                if (game.homeScore === "BYE" || game.awayScore === "BYE") {
                    scoreDisplay = "BYE WEEK";
                } 
                // 2. If BOTH are numbers, display the final score (e.g., "2 - 1")
                else if (homeIsNumber && awayIsNumber) {
                    scoreDisplay = `${game.homeScore} - ${game.awayScore}`;
                }
                // 3. If they aren't numbers, but Home Score has custom text (like "8:00 PM"), show it!
                else if (game.homeScore !== "TBD" && game.homeScore !== "") {
                    scoreDisplay = game.homeScore;
                }
                // 4. Fallback: if everything is just TBD or empty
                else {
                    scoreDisplay = "TBD";
                }
                
                html += `
                <tr class="game-row">
                    <td>${game.home}</td>
                    <td class="score" style="text-align:center;">${scoreDisplay}</td>
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