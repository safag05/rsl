fetch('/data/fixtures.json')
.then(res => res.json())
.then(data => {
  let table = {};

  data.weeks.forEach(week => {
    week.days.forEach(day => {
      day.games.forEach(game => {
        // Skip games that are not played yet (TBD)
        if (game.homeScore === "TBD" || game.awayScore === "TBD") return;

        const hScore = parseInt(game.homeScore);
        const aScore = parseInt(game.awayScore);

        // Initialize teams in the object if they don't exist
        [game.home, game.away].forEach(team => {
          if (!table[team]) {
            table[team] = { team: team, played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, pts: 0 };
          }
        });

        table[game.home].played++;
        table[game.away].played++;
        table[game.home].gf += hScore;
        table[game.home].ga += aScore;
        table[game.away].gf += aScore;
        table[game.away].ga += hScore;

        if (hScore > aScore) {
          table[game.home].win++;
          table[game.home].pts += 3;
          table[game.away].loss++;
        } else if (hScore < aScore) {
          table[game.away].win++;
          table[game.away].pts += 3;
          table[game.home].loss++;
        } else {
          table[game.home].draw++;
          table[game.away].draw++;
          table[game.home].pts += 1;
          table[game.away].pts += 1;
        }
      });
    });
  });

  // Sort by Points (pts), then Goal Difference (gf - ga)
  let standings = Object.values(table).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    return (b.gf - b.ga) - (a.gf - a.ga);
  });

  renderStandings(standings);
});

function renderStandings(standings) {
  let html = `
    <table class="fixtures-table">
        <thead>
            <tr class="week-title-row">
                <th colspan="8">LEAGUE STANDINGS</th>
            </tr>
            <tr>
                <th style="text-align:left; padding-left:20px;">Team</th>
                <th>P</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>PTS</th>
            </tr>
        </thead>
        <tbody>`;

  standings.forEach(row => {
    html += `
      <tr class="game-row">
          <td style="text-align:left; padding-left:20px; font-weight:bold;">${row.team}</td>
          <td>${row.played}</td>
          <td>${row.win}</td>
          <td>${row.draw}</td>
          <td>${row.loss}</td>
          <td>${row.gf}</td>
          <td>${row.ga}</td>
          <td style="font-weight:bold; color:#2c3e50;">${row.pts}</td>
      </tr>`;
  });

  html += `</tbody></table>`;
  document.getElementById('standings-container').innerHTML = html;
}