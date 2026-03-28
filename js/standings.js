fetch('/data/fixtures.json')
.then(res => res.json())
.then(data => {
  let table = {};

  data.weeks.forEach(week => {
    week.days.forEach(day => { // Added this layer
      day.games.forEach(game => { // Games are now inside days
        
        // Skip games that are not played yet
        if (game.homeScore === "TBD" || game.awayScore === "TBD") return;

        // Ensure we are working with numbers
        const hScore = parseInt(game.homeScore);
        const aScore = parseInt(game.awayScore);

        if (!table[game.home]) {
          table[game.home] = {team: game.home, played:0, win:0, draw:0, loss:0, gf:0, ga:0, pts:0};
        }
        if (!table[game.away]) {
          table[game.away] = {team: game.away, played:0, win:0, draw:0, loss:0, gf:0, ga:0, pts:0};
        }

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

  // The rest of your sorting and rendering code...
  let standings = Object.values(table).sort((a,b) => b.pts - a.pts);
  // ...
});