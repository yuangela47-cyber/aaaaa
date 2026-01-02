
export interface Member {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
  theme?: string;
}

export enum AppTab {
  INPUT = 'input',
  LUCKY_DRAW = 'lucky-draw',
  GROUPING = 'grouping'
}
