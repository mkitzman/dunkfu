// Young Gun candidates: players 20 and under this season, with birthdates so
// each drops off the day he turns 21. Hard-coded (the box score API has no
// ages, and bios cost API requests); add next season's rookies here.
export const BIRTHDATES = {
  'Cooper Flagg': '2006-12-21', 'Dylan Harper': '2006-03-02', 'Cameron Boozer': '2007-07-18',
  'Darius Acuff Jr.': '2006-11-16', 'Caleb Wilson': '2006-07-18', 'Darryn Peterson': '2007-01-17',
  'Jeremiah Fears': '2006-10-14', 'AJ Dybantsa': '2007-01-29', 'Ace Bailey': '2006-08-13',
  'Meleek Thomas': '2006-08-06', 'Nolan Traore': '2006-05-28', 'Keaton Wagler': '2007-02-03',
  'Mikel Brown Jr.': '2006-04-03', 'Tre Johnson': '2006-03-07', 'Egor Demin': '2006-03-03',
  'Joan Beringer': '2006-11-11', 'Morez Johnson Jr.': '2006-01-25', 'Khaman Maluach': '2006-09-14',
  'Kingston Flemings': '2007-01-03', 'Hugo Gonzalez': '2006-02-05', 'Nate Ament': '2006-12-10',
  'Kasparas Jakucionis': '2006-05-29', 'Will Riley': '2006-02-10', 'Ben Saraf': '2006-04-14',
  'Allen Graves': '2006-07-28', 'Noa Essengue': '2006-12-18', 'Karim Lopez': '2007-04-12',
  'Christian Anderson': '2006-04-02', 'Thomas Sorber': '2005-12-25', 'Ebuka Okorie': '2007-04-10',
  'Chris Cenac Jr.': '2007-02-01', 'Koa Peat': '2007-01-20', 'Hannes Steinbach': '2006-05-01',
  'Sergio De Larrea': '2005-12-04', 'Jayden Quaintance': '2007-07-11', 'Isaiah Evans': '2005-12-06',
  'Rocco Zikarsky': '2006-07-11',
}
const byName = Object.fromEntries(Object.entries(BIRTHDATES).map(([n, d]) => [n.toLowerCase(), d]))

// Age in whole years on `date` (YYYY-MM-DD), or null if he isn't on the list.
export function ageOn(name, date) {
  const b = byName[name?.toLowerCase()]
  if (!b || !date) return null
  return Number(date.slice(0, 4)) - Number(b.slice(0, 4)) - (date.slice(5) < b.slice(5) ? 1 : 0)
}
