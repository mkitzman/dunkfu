// Award badge system ("patch" badges, rev 7). One entry per award, in the
// fixed display order used everywhere (lists, stacks, legends). Adding an
// award = one entry here + the server rule in server/awards.js (earned() or
// a one-a-night pick) + its key in AWARD_ORDER (server/playerLogs.js).
//
// tone: 'lead' (NBA leaders) and 'absent' (DNP) flip with the page theme on
// neutral surfaces; on a team-colour surface the dark values are used.
// Glyphs are 24×24 single-colour SVG markup (fill / stroke = currentColor).
export const AWARD_TYPES = [
  { key: 'potn', label: 'Player of the Night', rule: 'Top Game Score of the night, all games', bg: '#F5B83D', fg: '#2b1d00',
    glyph: '<path d="M3.2 8.2l4.5 4L12 5.6l4.3 6.6 4.5-4-1.7 9.6H4.9z"/><rect x="4.9" y="19" width="14.2" height="2.4" rx=".9"/><circle cx="3.2" cy="7.4" r="1.7"/><circle cx="12" cy="4.4" r="1.8"/><circle cx="20.8" cy="7.4" r="1.7"/>' }, // crown
  { key: 'potg', label: 'Player of the Game', rule: 'Top Game Score in his game', bg: '#F26B21', fg: '#ffffff',
    glyph: '<path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3 1.1-6.5L2.6 9.3l6.5-.9z"/>' },
  { key: 'pts', label: 'Top Scorer', rule: 'Most points in the NBA that night', tone: 'lead',
    glyph: '<path d="M12.6 2c.6 3.2-.9 5-2.5 6.7C8.6 10.3 7 12 7 14.8 7 18.2 9.2 21 12.2 21s5.3-2.6 5.3-6c0-2-.8-3.6-1.8-4.8-.2 1.5-.9 2.6-2.1 3.1.6-3.4-.2-7.9-1-11.1z"/>' },
  { key: 'reb', label: 'Top Rebounder', rule: 'Most rebounds in the NBA that night', tone: 'lead',
    glyph: '<circle cx="12" cy="4.4" r="3.1"/><path d="M3 10h18" stroke-width="2.4" stroke-linecap="round"/><path d="M5 10l2.2 11h9.6L19 10" fill="none" stroke-width="2" stroke-linejoin="round"/><path d="M9.2 10l1 11M14.8 10l-1 11M6.1 14.5h11.8M6.9 18h10.2" stroke-width="1.5"/>' },
  { key: 'ast', label: 'Top Playmaker', rule: 'Most assists in the NBA that night', tone: 'lead',
    glyph: '<circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="M6 13.5C8 6 15.5 5 18 11.5" fill="none" stroke-width="2.2" stroke-linecap="round"/><path d="M14.6 10.6l3.6 1.6 1.2-3.8" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' },
  { key: 'stl', label: 'Ball Hawk', rule: '5+ steals in a game', bg: '#4C7DFF', fg: '#ffffff',
    glyph: '<path d="M12 5.2c-1 0-1.7.8-1.8 1.7l-.5 3.4C7.1 8.4 4.3 7.4 1.2 7.7c2 1.5 3.6 3.2 4.6 5.2l-2.2.7c2.3.5 4.3.4 6-.3l.8 4.3-1.8 3.2h6.8l-1.8-3.2.8-4.3c1.7.7 3.7.8 6 .3l-2.2-.7c1-2 2.6-3.7 4.6-5.2-3.1-.3-5.9.7-8.5 2.6l-.5-3.4c-.1-.9-.8-1.7-1.8-1.7z"/>' }, // hawk
  { key: 'blk', label: 'Rim Protector', rule: '5+ blocks in a game', bg: '#4C7DFF', fg: '#ffffff',
    glyph: '<path fill-rule="evenodd" d="M3.4 2.6Q12 5 20.6 2.6V10.4C20.6 16.2 16.9 20 12 22.6 7.1 20 3.4 16.2 3.4 10.4ZM6.4 11.6a5.6 5.6 0 1 0 11.2 0 5.6 5.6 0 1 0-11.2 0zM8.1 11.6a3.9 3.9 0 1 0 7.8 0 3.9 3.9 0 1 0-7.8 0zM9.95 8.42L15.18 13.65 14.05 14.78 8.82 9.55z"/>' }, // shield
  { key: 'breakout', label: 'Lightning in a Bottle', rule: 'Biggest jump over his usual Game Score, not the Player of the Night', bg: '#1F9D6B', fg: '#ffffff',
    glyph: '<path d="M14 1.8L4.6 13.4h6.2L9.6 22.2 19.4 10h-6.4z"/>' }, // bolt
  { key: 'cmp', label: 'Completionist', rule: 'Played every minute of the game', bg: '#3B4BA8', fg: '#ffffff',
    glyph: '<rect x="10" y="1.5" width="4" height="2.4" rx=".8"/><path fill-rule="evenodd" d="M12 4.6a9 9 0 1 1 0 18 9 9 0 1 1 0-18zM12 6.9a6.7 6.7 0 1 0 0 13.4 6.7 6.7 0 1 0 0-13.4z"/><path d="M8.6 13.8l2.3 2.3 4.6-4.8" fill="none" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>' }, // stopwatch
  { key: 'ddb', label: 'Double Double', rule: '10+ in two stat categories', bg: '#E8202A', fg: '#FFD100',
    glyph: '<path d="M3 8.6C3 5.2 7 3 12 3s9 2.2 9 5.6z"/><rect x="2.5" y="9.8" width="19" height="2.8" rx="1.4"/><path d="M5.5 12.4h5.6l-2.8 2.6z"/><rect x="2.5" y="13.8" width="19" height="2.8" rx="1.4"/><path d="M13 16.4h5.6l-2.8 2.6z"/><rect x="3.5" y="17.8" width="17" height="3.2" rx="1.6"/>' }, // double-patty burger
  { key: 'sun', label: 'Good Day', rule: 'Messed around and got a triple double', bg: '#FFDD33', fg: '#D9480F',
    glyph: '<circle cx="12" cy="12" r="4.6"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" fill="none" stroke-width="2.2" stroke-linecap="round"/>' }, // sun
  { key: 'yng', label: 'Young Gun', rule: 'Big game (Game Score 22+) by a player 20 or under', bg: '#8BC34A', fg: '#1F2D0A',
    glyph: '<path d="M11 21.5v-9c0-.6.4-1 1-1s1 .4 1 1v9z"/><path d="M12 13C12 8 8.5 5 3.2 5.2 3 10.3 6.3 13.2 12 13z"/><path d="M12.4 10.6c.2-4.6 3.4-7.4 8.4-7.4.1 4.8-3 7.6-8.4 7.4z"/><rect x="6" y="20.2" width="12" height="2" rx="1"/>' }, // sprout
  { key: 'rain', label: 'Rainmaker', rule: '9+ threes in a game', bg: '#1FA2D6', fg: '#ffffff',
    glyph: '<path d="M6.5 14h11a3.7 3.7 0 0 0 .5-7.35A5.6 5.6 0 0 0 7.3 5.4 4.3 4.3 0 0 0 6.5 14z"/><path d="M8 16.6l-1.2 3.6M12 16.6l-1.2 3.6M16 16.6l-1.2 3.6" fill="none" stroke-width="2.2" stroke-linecap="round"/>' }, // cloud, three drops
  { key: 'bricklayer', label: 'Bricklayer', rule: 'Most missed shots in the NBA that night (FG + FT), under 50% true shooting', bg: '#8A6240', fg: '#ffffff',
    glyph: '<path fill-rule="evenodd" d="M2 6.5h20v11H2zM2 11.3h20v1.4H2zM8.3 6.5h1.4v4.8H8.3zM14.3 12.7h1.4v4.8h-1.4z"/>' }, // bricks
  { key: 'dud', label: 'Dud of the Night', rule: 'Furthest below his usual, starters / 20+ MIN', bg: '#A34E24', fg: '#ffffff',
    glyph: '<path fill-rule="evenodd" d="M12.8 2c.5 1.2.1 2.1-.9 2.6 2.7.2 4.5 1.7 4.5 3.4 0 .2 0 .4-.1.6 2 .4 3.4 1.8 3.4 3.5 0 .4-.1.8-.3 1.2 1.8.5 3.1 1.9 3.1 3.7 0 2.5-2.4 3.9-5.4 3.9H8.4C5.4 20.9 3 19.5 3 17c0-1.8 1.3-3.2 3.1-3.7-.2-.4-.3-.8-.3-1.2 0-1.7 1.4-3.1 3.4-3.5-.1-.2-.1-.4-.1-.6 0-1.5 1.3-2.7 3.1-3.2.4-.9.7-1.8.6-2.8zM9.4 8.9q2.6 1.1 5.2 0l.3 1q-2.9 1.2-5.8 0zM7.2 13.2q4.8 1.6 9.6 0l.3 1q-5.1 1.7-10.2 0z"/>' }, // poop swirl
  { key: 'dudg', label: 'Dud of the Game', rule: 'Furthest below his usual in his game, starters / 20+ MIN', bg: '#4E4232', fg: '#EDE3D2',
    glyph: '<g transform="matrix(1 0 0 -1 0 24)"><rect x="2" y="10" width="4" height="11" rx="1"/><path d="M7.5 10.5L11.5 3.2c.4-.8 1.4-1.1 2.2-.6.9.5 1.2 1.6.9 2.5L13.6 9h5.9c1.4 0 2.4 1.3 2.1 2.6l-1.6 7.4c-.2 1.1-1.2 1.9-2.3 1.9H7.5z"/></g>' }, // thumbs down
  { key: 'hog', label: 'Ball Hog', rule: 'Most shots in the NBA that night with 15+ FGA and at most 1 assist', bg: '#F28CB1', fg: '#4A1430',
    glyph: '<g transform="matrix(1.15 0 0 1.15 -1.8 -1.8)"><path d="M4 3.2l6 3.6-4.6 3.4z"/><path d="M20 3.2l-6 3.6 4.6 3.4z"/><path fill-rule="evenodd" d="M12 6a9 7.6 0 1 1 0 15.2A9 7.6 0 1 1 12 6zM8.3 15.2a3.7 2.7 0 1 0 7.4 0 3.7 2.7 0 1 0-7.4 0zM7.6 10.9a1.05 1.05 0 1 0 2.1 0 1.05 1.05 0 1 0-2.1 0zM14.3 10.9a1.05 1.05 0 1 0 2.1 0 1.05 1.05 0 1 0-2.1 0z"/><circle cx="10.6" cy="15.2" r=".85"/><circle cx="13.4" cy="15.2" r=".85"/></g>' }, // pig
  { key: 'tril', label: 'Trillionaire', rule: 'Exactly 1 minute and zeros everywhere else, fouls included: 1,000,000,000,000', bg: '#4F7A5A', fg: '#EAF2DF',
    glyph: '<path fill-rule="evenodd" d="M3 5.5h18a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 17V7A1.5 1.5 0 0 1 3 5.5zM12 7.4a3.8 4.6 0 1 0 0 9.2 3.8 4.6 0 1 0 0-9.2zM3.9 9a1.2 1.2 0 1 0 2.4 0 1.2 1.2 0 1 0-2.4 0zM17.7 15a1.2 1.2 0 1 0 2.4 0 1.2 1.2 0 1 0-2.4 0z"/><path d="M13.5 10.1c-.3-.6-.9-1-1.6-1-.9 0-1.6.6-1.6 1.2 0 1.6 3.3 1.1 3.3 2.9 0 .7-.7 1.3-1.7 1.3-.8 0-1.4-.4-1.7-1M11.9 8.3v7.4" fill="none" stroke-width="1.4" stroke-linecap="round"/>' }, // dollar bill
  { key: 'cardio', label: 'Cardio Day', rule: '5+ minutes and zeros everywhere else, fouls included', bg: '#7A0A14', fg: '#ffffff',
    glyph: '<path d="M12 20.4l-1.3-1.2C5.9 14.8 3 12.2 3 8.9 3 6.2 5.1 4.1 7.8 4.1c1.6 0 3.1.7 4.2 1.9 1.1-1.2 2.6-1.9 4.2-1.9 2.7 0 4.8 2.1 4.8 4.8 0 3.3-2.9 5.9-7.7 10.3z" fill="none" stroke-width="2.2" stroke-linejoin="round"/><path d="M6.2 11.2h2.6l1.4-2.8 2.4 5.4 1.4-2.6h3.8" fill="none" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>' }, // heart, pulse line
  { key: 'dnp', label: 'DNP', rule: 'On the box score, no minutes', tone: 'absent',
    glyph: '<rect x="4" y="4" width="16" height="4.5" rx="1.2"/><rect x="2.5" y="11" width="19" height="4" rx="1.2"/><path d="M6 15v6M18 15v6M6 8.5V11M18 8.5V11" stroke-width="2.4" stroke-linecap="round"/>' },
  { key: 'inj', label: 'Injured', rule: 'Missed the game (not on the box score)', bg: '#DA2C38', fg: '#ffffff',
    glyph: '<path d="M9.2 2.5h5.6v6.7h6.7v5.6h-6.7v6.7H9.2v-6.7H2.5V9.2h6.7z"/>' },
]

export const AWARD = Object.fromEntries(AWARD_TYPES.map(a => [a.key, a]))
