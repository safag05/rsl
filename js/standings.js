fetch('/data/fixtures.json')
.then(res => res.json())
.then(data => {
  let table = {};

  data.weeks.forEach(week => {
    week.days.forEach(day => {
      day.games.forEach(game => {
        // 1. Check if BOTH score fields contain ONLY numbers
        // This regex (/^\d+$/) means "only digits 0-9". 
        // It will reject "TBD", "BYE", "8:00 PM", "18:30", etc.
        const homeIsNumber = /^\d+$/.test(String(game.homeScore).trim());
        const awayIsNumber = /^\d+$/.test(String(game.awayScore).trim());

        // 2. If either field is not a pure number, skip calculating standings for this game
        if (!homeIsNumber || !awayIsNumber) {
          return; 
        }

        const hScore = parseInt(game.homeScore, 10);
        const aScore = parseInt(game.awayScore, 10);

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

  // Sort by Points (pts), then Goal Difference (gd), then Goals For (gf)
  let standings = Object.values(table).sort((a, b) => {
    // 1st Tie-breaker: Points
    if (b.pts !== a.pts) return b.pts - a.pts;

    // 2nd Tie-breaker: Goal Difference (GF - GA)
    const gdA = a.gf - a.ga;
    const gdB = b.gf - b.ga;
    if (gdB !== gdA) return gdB - gdA;

    // 3rd Tie-breaker: Goals For
    return b.gf - a.gf;
  });

  renderStandings(standings);
});

function renderStandings(standings) {
  let html = `
    <table class="fixtures-table standings-table">
        <thead>
            <tr class="week-title-row">
                <th colspan="10">LEAGUE STANDINGS - 2026</th> 
            </tr>
            <tr>
                <th class="col-stat">#</th> <th class="col-team">Team</th>
                <th class="col-stat">P</th>
                <th class="col-stat">W</th>
                <th class="col-stat">D</th>
                <th class="col-stat">L</th>
                <th class="col-stat">GF</th>
                <th class="col-stat">GA</th>
                <th class="col-stat">GD</th>
                <th class="col-stat">PTS</th>
            </tr>
        </thead>
        <tbody>`;

  standings.forEach((row, i) => {
    const gd = row.gf - row.ga;
    const displayGD = gd > 0 ? `+${gd}` : gd;

    html += `
      <tr class="game-row">
          <td class="col-stat" style="font-weight:bold; color:#7f8c8d;">${i + 1}</td>
          <td class="team-cell">${row.team}</td>
          <td class="col-stat">${row.played}</td>
          <td class="col-stat">${row.win}</td>
          <td class="col-stat">${row.draw}</td>
          <td class="col-stat">${row.loss}</td>
          <td class="col-stat">${row.gf}</td>
          <td class="col-stat">${row.ga}</td>
          <td class="col-stat" style="font-weight:bold;">${displayGD}</td>
          <td class="col-stat" style="font-weight:bold; color:#2c3e50;">${row.pts}</td>
      </tr>`;
  });

  html += `</tbody></table>`;
  document.getElementById('standings-container').innerHTML = html;
}