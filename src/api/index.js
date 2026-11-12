// Data access for the site. Pages only talk to these functions.
//
// By default they read the JSON written by `npm run fetch-data` (see
// scripts/fetch-data.js). Set VITE_MOCK=1 to use the design-handoff mock data.
//
//   getGames(date)      games on a date, with quarters, records, status
//   getBoxscores(date)  player lines for that date's finals
//   getAverages(teams)  season per-game averages for players on those teams
//   getGame(id)         one game with venue + full player lines
//   getStandings()      30 rows with splits, seed, seedPrev (seed before last night)
//   getAwards(date)     high performer + dud for the night and for each game
//   getTeamLog(abbr)    player card: game logs + awards for a team's players
//   getPlayerBio(id,gp) player card: bio (height, weight, born, draft…)
import * as real from './real.js'
import * as mock from './mock/index.js'

const src = import.meta.env.VITE_MOCK ? mock : real

export const { getGames, getBoxscores, getAverages, getGame, getStandings, getAwards, getTeamLog, getPlayerBio } = src
