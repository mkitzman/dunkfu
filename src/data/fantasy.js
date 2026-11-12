// Fantasy points per game line. Yahoo public-league defaults; swap the
// weights here to change scoring site-wide.
export const FANTASY_WEIGHTS = { pts: 1, reb: 1.2, ast: 1.5, stl: 3, blk: 3, to: -1 }

export function fantasyPoints(line) {
  let s = 0
  for (const [k, w] of Object.entries(FANTASY_WEIGHTS)) s += (line[k] ?? 0) * w
  return Math.round(s * 10) / 10
}
