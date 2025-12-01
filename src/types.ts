export type Hike = {
  id: string;
  name: string;
  location: string;
  date: string;
  lengthKm: number;
  difficulty?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
};

export type Coords = {
  latitude: number;
  longitude: number;
};
