// Award badge system ("patch" badges, rev 5). One entry per award, in the
// fixed display order used everywhere (lists, stacks, legends). Adding an
// award = one entry here + the server rule in server/playerLogs.js.
//
// tone: 'lead' (NBA leaders) and 'absent' (DNP) flip with the page theme on
// neutral surfaces; on a team-colour surface the dark values are used.
// Glyphs are 24×24 single-colour SVG markup (fill / stroke = currentColor).
export const AWARD_TYPES = [
  { key: 'potn', label: 'Player of the Night', rule: 'Top Game Score of the night, all games', bg: '#F26B21', fg: '#ffffff',
    glyph: '<path d="M3.2 8.2l4.5 4L12 5.6l4.3 6.6 4.5-4-1.7 9.6H4.9z"/><rect x="4.9" y="19" width="14.2" height="2.4" rx=".9"/><circle cx="3.2" cy="7.4" r="1.7"/><circle cx="12" cy="4.4" r="1.8"/><circle cx="20.8" cy="7.4" r="1.7"/>' }, // crown
  { key: 'potg', label: 'Player of the Game', rule: 'Top Game Score in his game', bg: '#F5B83D', fg: '#2b1d00',
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
  { key: 'dud', label: 'Dud of the Night', rule: 'Furthest below his usual, starters / 20+ MIN', bg: '#e5484d', fg: '#ffffff',
    glyph: '<path fill-rule="evenodd" d="M2 6.5h20v11H2zM2 11.3h20v1.4H2zM8.3 6.5h1.4v4.8H8.3zM14.3 12.7h1.4v4.8h-1.4z"/>' },
  { key: 'dnp', label: 'Did not play', rule: 'On the box score, no minutes', tone: 'absent',
    glyph: '<rect x="4" y="4" width="16" height="4.5" rx="1.2"/><rect x="2.5" y="11" width="19" height="4" rx="1.2"/><path d="M6 15v6M18 15v6M6 8.5V11M18 8.5V11" stroke-width="2.4" stroke-linecap="round"/>' },
  { key: 'inj', label: 'Injured', rule: 'Missed the game (not on the box score)', bg: '#8c3550', fg: '#ffd6df',
    glyph: '<path d="M9.2 2.5h5.6v6.7h6.7v5.6h-6.7v6.7H9.2v-6.7H2.5V9.2h6.7z"/>' },
]

export const AWARD = Object.fromEntries(AWARD_TYPES.map(a => [a.key, a]))
