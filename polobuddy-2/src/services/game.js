const { Game } = require('../models/newGame'); 
const { sortPlayersByPlayPercentage, weightPlayerIncrementally} = require('../libs/gameUtilities');
const { convertSingleDigitToTimestamp } = require('../libs/utilities');
const { updateActiveGameInSession } = require('./session.js');
let teams = [
  {
    teamWeight: 0,
    players: []
  },
  {
    teamWeight: 0,
    players: []
  }
];

// Recursively and Incrementally select players based on previous chosen player
const selectPlayersForTeams = (players, i=1, previousPlayerWeight) => {
  if (players.length > 0) {
    const teamIndex = i % 2 === 0 ? 1 : 0;
    const highestGameWeight = previousPlayerWeight ? previousPlayerWeight : players[0].weight;
    
    //Highest weight by games played ratio
    const currentHighestWeightedPlayers = players.filter(player => player.weight === highestGameWeight);
    const randIndex = Math.floor(Math.random() * currentHighestWeightedPlayers.length); // #, or 0
    let modifiedPlayerPool = currentHighestWeightedPlayers.length > 0 ? currentHighestWeightedPlayers : players;
    const chosenPlayer = modifiedPlayerPool[randIndex];

    teams[teamIndex].players.push(chosenPlayer);
    teams[teamIndex].teamWeight += chosenPlayer.skillLevel;

    modifiedPlayerPool = players.filter(p => p.name !== chosenPlayer.name);

    //weights remaining player's skillweight based on chosen player's skill level
    weightPlayerIncrementally(chosenPlayer.skillLevel, modifiedPlayerPool);

    if (i <= 5) {
      let index = i+1;
      selectPlayersForTeams(modifiedPlayerPool, index, highestGameWeight);
    }
  }
}

const generateTeams = (players, totalGames) => {
  const playerPool = sortPlayersByPlayPercentage(players, totalGames);
  selectPlayersForTeams(playerPool);
  return teams;
}
/*
this.isStarted = false;
    this.speed = null;
    this.timeRemaining = 0;
    this.teams = {
      teamOne: [],
      teamTwo: []
    }
*/
const startGameInSession = async(sessionId, teams, speed) => {
  const newGame = new Game();
  newGame.isStarted = true;
  newGame.speed = 'Testing';
  newGame.endsOn = convertSingleDigitToTimestamp(15);
  newGame.duration = 1;
  teams.forEach((team, index) => {
    newGame.teams.push(team)
  });
   
  await updateActiveGameInSession(newGame, sessionId);
  return newGame;
};


export {
  startGameInSession,
  generateTeams
}
