export interface Rate {
  compound: string;
  maturity?: { year: number; month?: number };
  name: string;
  full_name?: string;
  rate: number;
  comments: string;
}
