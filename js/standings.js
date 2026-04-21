fetch('/data/fixtures.json')
.then(res => res.json())
.then(data => {
  let table = {};

  // REGULAR SEASON CALCULATIONS ONLY
  data.weeks.forEach(week => {
    week.days.forEach(day => {
      day.games.forEach(game => {
        const homeIsNumber = /^\d+$/.test(String(game.homeScore).trim());
        const awayIsNumber = /^\d+$/.test(String(game.awayScore).trim());

        if (!homeIsNumber || !awayIsNumber) return; 

        const hScore = parseInt(game.homeScore, 10);
        const aScore = parseInt(game.awayScore, 10);

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
          table[game.home].win++; table[game.home].pts += 3; table[game.away].loss++;
        } else if (hScore < aScore) {
          table[game.away].win++; table[game.away].pts += 3; table[game.home].loss++;
        } else {
          table[game.home].draw++; table[game.away].draw++; table[game.home].pts += 1; table[game.away].pts += 1;
        }
      });
    });
  });

  let standings = Object.values(table).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const gdA = a.gf - a.ga; const gdB = b.gf - b.ga;
    if (gdB !== gdA) return gdB - gdA;
    return b.gf - a.gf;
  });

  renderStandings(standings);

  // Render Playoff Results
  if (data.playoffs && data.playoffs.length > 0) {
      renderPlayoffResults(data.playoffs);
  }
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
                <th class="col-stat">P</th><th class="col-stat">W</th><th class="col-stat">D</th>
                <th class="col-stat">L</th><th class="col-stat">GF</th><th class="col-stat">GA</th>
                <th class="col-stat">GD</th><th class="col-stat">PTS</th>
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

function renderPlayoffResults(playoffs) {
    let html = `<h2 style="text-align: center; color: #2c3e50; margin-top: 20px;">🏆 TOURNAMENT RESULTS 🏆</h2>`;

    playoffs.forEach(round => {
        let roundHasResults = false;
        let roundHtml = `
        <table class="fixtures-table standings-table" style="margin-top: 20px;">
            <thead>
                <tr class="week-title-row">
                    <th colspan="3" style="background-color: #2c3e50; color: white;">${round.round}</th>
                </tr>
            </thead>
            <tbody>`;

        round.days.forEach(day => {
            let dayHasResults = false;
            let dayHtml = `
            <tr class="date-header-row">
                <th colspan="3" style="background-color: #ecf0f1; color: #34495e; font-size: 0.9em; text-align: center;">
                    ${day.dateHeader}
                </th>
            </tr>`;

            day.games.forEach(game => {
                const homeIsNumber = /^\d+$/.test(String(game.homeScore).trim());
                const awayIsNumber = /^\d+$/.test(String(game.awayScore).trim());

                if (homeIsNumber && awayIsNumber) {
                    roundHasResults = true;
                    dayHasResults = true;
                    
                    const hScore = parseInt(game.homeScore, 10);
                    const aScore = parseInt(game.awayScore, 10);
                    let hStyle = hScore > aScore ? "color: #27ae60; font-weight: bold;" : "";
                    let aStyle = aScore > hScore ? "color: #27ae60; font-weight: bold;" : "";

                    let gameLabel = game.label ? `<div style="font-size: 0.8em; color: #d35400; text-align: center; margin-bottom: 4px;">${game.label}</div>` : '';

                    dayHtml += `
                    <tr class="game-row">
                        <td style="text-align: right; width: 40%; ${hStyle}">${game.home}</td>
                        <td style="text-align: center; width: 20%; font-weight: bold;">
                            ${gameLabel}
                            ${game.homeScore} - ${game.awayScore}
                        </td>
                        <td style="text-align: left; width: 40%; ${aStyle}">${game.away}</td>
                    </tr>`;
                }
            });

            // Only append the day's header and games if there are completed games in that section
            if (dayHasResults) {
                roundHtml += dayHtml;
            }
        });

        roundHtml += `</tbody></table>`;

        if (roundHasResults) {
            html += roundHtml;
        }
    });

    const playoffsContainer = document.getElementById('playoffs-results-container');
    if (playoffsContainer) {
        playoffsContainer.innerHTML = html;
    }
}