fetch('/data/fixtures.json')
.then(res => res.json())
.then(data => {

  let table = {};

  data.weeks.forEach(week => {

    week.games.forEach(game => {

      if (!table[game.home]) {
        table[game.home] = {team: game.home, played:0, win:0, draw:0, loss:0, gf:0, ga:0, pts:0};
      }

      if (!table[game.away]) {
        table[game.away] = {team: game.away, played:0, win:0, draw:0, loss:0, gf:0, ga:0, pts:0};
      }

      table[game.home].played++;
      table[game.away].played++;

      table[game.home].gf += game.homeScore;
      table[game.home].ga += game.awayScore;

      table[game.away].gf += game.awayScore;
      table[game.away].ga += game.homeScore;

      if (game.homeScore > game.awayScore) {
        table[game.home].win++;
        table[game.home].pts += 3;
        table[game.away].loss++;
      }
      else if (game.homeScore < game.awayScore) {
        table[game.away].win++;
        table[game.away].pts += 3;
        table[game.home].loss++;
      }
      else {
        table[game.home].draw++;
        table[game.away].draw++;
        table[game.home].pts += 1;
        table[game.away].pts += 1;
      }

    });

  });

  let standings = Object.values(table);

  standings.sort((a,b) => b.pts - a.pts);

  const container = document.getElementById("league-table");

  let html = `
  <table class="pointstable">
  <tr>
    <th>Team</th>
    <th>P</th>
    <th>W</th>
    <th>D</th>
    <th>L</th>
    <th>GF</th>
    <th>GA</th>
    <th>Pts</th>
  </tr>
  `;

  standings.forEach(team => {

    html += `
      <tr>
        <td>${team.team}</td>
        <td>${team.played}</td>
        <td>${team.win}</td>
        <td>${team.draw}</td>
        <td>${team.loss}</td>
        <td>${team.gf}</td>
        <td>${team.ga}</td>
        <td>${team.pts}</td>
      </tr>
    `;

  });

  html += "</table>";

  container.innerHTML = html;

});