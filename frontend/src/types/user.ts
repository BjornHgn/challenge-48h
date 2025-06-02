export interface User {
  id: string;
  email: string;
  username: string;
  favoriteStations?: string[];
  lastLogin?: string;
  role?: string;
}