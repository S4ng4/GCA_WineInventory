export type MacroCategory = 'Bollicine' | 'Bianchi' | 'Rosati' | 'Rossi' | 'Dolci';

export interface WineItem {
  id: string;
  m: MacroCategory;
  r: string; // Region ("" if none)
  g: string; // Group ("" if none)
  n: string; // Wine name (verbatim)
}

export interface InventoryState {
  c: Record<string, number>; // counts by id; absent key = uncounted, 0 = counted as 0
  add: WineItem[];           // user-added wines ('n1', 'n2', ...)
  del: string[];             // removed base wine ids
  ren: Record<string, string>; // base id -> renamed name
  nid: number;               // auto-increment for added items
  to: string;                // recipient email
  who: string;               // counter person name
  only: boolean;             // include only counted wines in export
}
