// Mock data lifted from the design prototypes. Shapes match what the real
// API layer should return (see src/api/index.js).

// Deterministic PRNG so mock numbers are stable between reloads.
export function rng(s) {
  let h = 1779033703 ^ s.length
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

// [abbr, w, l, seed change last night]
export const RECORDS = [
  ['PHI', 6, 1, 2], ['DET', 5, 1, 3], ['BOS', 4, 1, -1], ['CLE', 4, 2, -2], ['TOR', 3, 2, 1],
  ['WAS', 3, 3, 4], ['NYK', 3, 3, -3], ['MIA', 3, 3, 0], ['ATL', 3, 4, -1], ['CHA', 3, 4, 2],
  ['ORL', 3, 4, -4], ['CHI', 2, 4, 0], ['MIL', 2, 4, -2], ['IND', 1, 5, 1], ['BKN', 0, 6, 0],
  ['OKC', 7, 0, 0], ['SAS', 5, 1, 3], ['POR', 4, 1, 5], ['DEN', 4, 2, -1], ['LAL', 4, 2, -2],
  ['GSW', 4, 3, -1], ['HOU', 3, 3, -3], ['PHX', 3, 3, 2], ['MIN', 3, 3, -2], ['LAC', 3, 3, 1],
  ['MEM', 3, 4, 0], ['DAL', 2, 4, -2], ['SAC', 2, 5, 1], ['UTA', 1, 5, -1], ['NOP', 0, 6, 0],
]

// Three featured players per team for the Last Night table.
export const PLAYERS = {
  POR: [['Deni Avdija', 'F', '8'], ['Scoot Henderson', 'G', '00'], ['Donovan Clingan', 'C', '23']],
  UTA: [['Lauri Markkanen', 'F', '23'], ['Keyonte George', 'G', '3'], ['Walker Kessler', 'C', '24']],
  BOS: [['Jayson Tatum', 'F', '0'], ['Jaylen Brown', 'G', '7'], ['Derrick White', 'G', '9']],
  NYK: [['Jalen Brunson', 'G', '11'], ['Karl-Anthony Towns', 'C', '32'], ['Mikal Bridges', 'F', '25']],
  DEN: [['Nikola Jokić', 'C', '15'], ['Jamal Murray', 'G', '27'], ['Aaron Gordon', 'F', '32']],
  LAL: [['Luka Dončić', 'G', '77'], ['LeBron James', 'F', '23'], ['Austin Reaves', 'G', '15']],
  OKC: [['Shai Gilgeous-Alexander', 'G', '2'], ['Jalen Williams', 'F', '8'], ['Chet Holmgren', 'C', '7']],
  DAL: [['Anthony Davis', 'F', '3'], ['Cooper Flagg', 'F', '32'], ['Kyrie Irving', 'G', '11']],
  MIA: [['Bam Adebayo', 'C', '13'], ['Tyler Herro', 'G', '14'], ['Andrew Wiggins', 'F', '22']],
  ORL: [['Paolo Banchero', 'F', '5'], ['Franz Wagner', 'F', '22'], ['Jalen Suggs', 'G', '4']],
  GSW: [['Stephen Curry', 'G', '30'], ['Jimmy Butler', 'F', '10'], ['Draymond Green', 'F', '23']],
  PHX: [['Devin Booker', 'G', '1'], ['Jalen Green', 'G', '4'], ['Dillon Brooks', 'F', '3']],
  MIL: [['Giannis Antetokounmpo', 'F', '34'], ['Myles Turner', 'C', '3'], ['Kevin Porter', 'G', '7']],
  CLE: [['Donovan Mitchell', 'G', '45'], ['Evan Mobley', 'F', '4'], ['Darius Garland', 'G', '10']],
  SAS: [['Victor Wembanyama', 'C', '1'], ["De'Aaron Fox", 'G', '4'], ['Stephon Castle', 'G', '5']],
  HOU: [['Kevin Durant', 'F', '7'], ['Alperen Şengün', 'C', '28'], ['Amen Thompson', 'G', '1']],
  MIN: [['Anthony Edwards', 'G', '5'], ['Julius Randle', 'F', '30'], ['Rudy Gobert', 'C', '27']],
  IND: [['Pascal Siakam', 'F', '43'], ['Bennedict Mathurin', 'G', '00'], ['Andrew Nembhard', 'G', '2']],
}

// Finals: [away, home, awayQuarters, homeQuarters]. Schedule: [away, home, tip, network].
export const DAYS = {
  '2026-10-30': {
    final: [
      ['MIL', 'CLE', [28, 26, 30, 26], [30, 29, 27, 29]],
      ['SAS', 'HOU', [31, 33, 28, 32], [29, 30, 31, 29]],
      ['MIN', 'IND', [27, 25, 28, 25], [22, 26, 24, 26]],
    ],
  },
  '2026-10-31': {
    final: [
      ['POR', 'UTA', [27, 32, 29, 24], [18, 24, 22, 26]],
      ['BOS', 'NYK', [26, 29, 25, 28], [30, 27, 31, 26]],
      ['DEN', 'LAL', [30, 27, 28, 24, 12], [29, 26, 30, 24, 9]],
      ['OKC', 'DAL', [35, 33, 30, 33], [24, 27, 26, 27]],
      ['MIA', 'ORL', [22, 27, 24, 26], [25, 24, 28, 26]],
      ['GSW', 'PHX', [31, 28, 27, 31], [30, 33, 29, 30]],
    ],
  },
  '2026-11-01': {
    scheduled: [
      ['CLE', 'BOS', '6:00 PM', 'ESPN'], ['IND', 'MIL', '7:00 PM', ''], ['HOU', 'SAS', '7:30 PM', 'NBA TV'],
      ['DAL', 'MIN', '8:00 PM', ''], ['LAL', 'GSW', '8:30 PM', 'ESPN'],
    ],
  },
  '2026-11-02': {
    scheduled: [
      ['NYK', 'MIA', '7:30 PM', 'TNT'], ['ORL', 'OKC', '8:00 PM', ''], ['UTA', 'DEN', '9:00 PM', ''],
      ['PHX', 'POR', '10:00 PM', 'TNT'],
    ],
  },
}

// Full box scores keyed by game id.
// [name, num, pos, min, pts, fgm, fga, tpm, tpa, ftm, fta, oreb, dreb, ast, stl, blk, to, pf, pm]
export const BOX = {
  '2026-10-31-POR-UTA': {
    away: [
      ['Toumani Camara', '33', 'F', 31, 14, 4, 9, 4, 9, 2, 2, 1, 4, 2, 2, 0, 1, 3, 18],
      ['Deni Avdija', '8', 'F', 30, 24, 6, 12, 2, 4, 10, 13, 2, 5, 3, 1, 1, 2, 2, 20],
      ['Donovan Clingan', '23', 'C', 15, 4, 1, 3, 0, 1, 2, 2, 4, 5, 0, 0, 2, 1, 4, 6],
      ['Damian Lillard', '0', 'G', 27, 22, 6, 17, 3, 10, 7, 8, 0, 3, 4, 1, 0, 5, 1, 14],
      ['Scoot Henderson', '00', 'G', 31, 14, 4, 11, 1, 4, 5, 6, 1, 2, 3, 2, 0, 2, 2, 16],
      ['Robert Williams III', '35', 'C', 14, 3, 1, 2, 0, 0, 1, 2, 2, 3, 1, 0, 2, 0, 3, 4],
      ['Micah Potter', '9', 'C', 4, 2, 0, 0, 0, 0, 2, 2, 0, 1, 0, 0, 0, 0, 1, 2],
      ['Branden Carlson', '10', 'C', 4, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      ['Yang Hansen', '16', 'C', 13, 6, 2, 5, 2, 3, 0, 0, 1, 2, 2, 0, 1, 1, 2, 8],
      ['Jrue Holiday', '5', 'G', 22, 14, 4, 6, 2, 4, 4, 4, 0, 3, 3, 2, 0, 1, 1, 12],
      ['Vit Krejci', '27', 'F', 24, 5, 2, 6, 1, 4, 0, 0, 1, 3, 2, 1, 0, 1, 2, 5],
      ['Chris Youngblood', '11', 'G', 7, 3, 1, 4, 1, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2],
      ['Sidy Cissoko', '91', 'G', 18, 1, 0, 0, 0, 0, 1, 2, 1, 2, 2, 1, 0, 1, 2, 2],
    ],
    home: [
      ['Ace Bailey', '19', 'F', 34, 12, 5, 13, 2, 6, 0, 0, 0, 7, 2, 1, 0, 1, 2, -15],
      ['Lauri Markkanen', '23', 'F', 33, 15, 5, 14, 2, 7, 3, 3, 1, 5, 1, 0, 1, 2, 3, -18],
      ['Jusuf Nurkić', '20', 'C', 22, 8, 4, 7, 0, 0, 0, 2, 2, 4, 3, 0, 1, 2, 4, -12],
      ['Keyonte George', '3', 'G', 31, 16, 6, 15, 1, 5, 3, 4, 0, 3, 3, 1, 0, 3, 2, -20],
      ['Isaiah Collier', '13', 'G', 28, 9, 4, 9, 0, 2, 1, 2, 1, 3, 4, 2, 0, 3, 1, -14],
      ['Walker Kessler', '24', 'C', 20, 6, 3, 5, 0, 0, 0, 0, 2, 3, 1, 0, 3, 1, 3, -8],
      ['Kyle Filipowski', '22', 'F', 18, 8, 3, 6, 2, 4, 0, 0, 1, 3, 1, 0, 0, 1, 2, -6],
      ['Brice Sensabaugh', '28', 'G', 16, 7, 3, 8, 1, 4, 0, 0, 0, 2, 1, 1, 0, 0, 1, -4],
      ['Svi Mykhailiuk', '10', 'G', 14, 5, 2, 5, 1, 3, 0, 0, 0, 1, 2, 0, 0, 1, 2, -5],
      ['Cody Williams', '5', 'F', 12, 2, 1, 4, 0, 2, 0, 0, 1, 1, 0, 0, 0, 1, 1, -3],
      ['Taylor Hendricks', '0', 'F', 8, 2, 1, 2, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, -2],
      ['Kyle Anderson', '1', 'F', 4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, -3],
    ],
  },
}
