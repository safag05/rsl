fetch('/data/fixtures.json')
.then(res => res.json())
.then(data => {

  const container = document.getElementById("fixtures-container");

  data.weeks.forEach(week => {

    let html = `
      <section class="done">
      <h2>${week.week}</h2>
      <table class="donetable">
      <tr>
        <th>Home</th>
        <th>Score</th>
        <th>Away</th>
      </tr>
    `;

    week.games.forEach(game => {

      html += `
        <tr>
          <td>${game.home}</td>
          <td>${game.homeScore} - ${game.awayScore}</td>
          <td>${game.away}</td>
        </tr>
      `;

    });

    html += "</table></section>";

    container.innerHTML += html;

  });

});