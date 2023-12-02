export function rankNumToStr(rank: number) {
  switch (rank) {
    case 1: return 'AAA';
    case 2: return 'AA';
    case 3: return 'A';
    case 4: return 'BBB';
    case 5: return 'BB';
    case 6: return 'B';
    case 7: return 'CCC';
    case 8: return 'CC';
    case 9: return 'C';
    default: return 'N/A';
  }
}

export function rankToColor(rank: string) {
  switch (rank) {
    case 'AAA': return '#693ce5';
    case 'AA': return '#9b3db3';
    case 'A': return '#c241b0';
    case 'BBB': return '#ee4395';
    case 'BB': return '#f65375';
    case 'B': return '#f66b54';
    case 'CCC': return '#f78c39';
    case 'CC': return '#e8b02d';
    case 'C': return '#c9d33a';
    default: return 'black';
  }
}

export function rankNumToColor(rank: number) {
  return rankToColor(rankNumToStr(rank));
}