export interface RoomCategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

export interface RoomHotspot {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Ruangan pada denah (App\Http\Resources\RoomResource).
export interface Room {
  id: number;
  slug: string;
  name: string;
  building_name: string | null;
  description: string | null;
  image: string | null;
  open_hours: string | null;
  is_active: boolean;
  category: RoomCategory | null;
  hotspot: RoomHotspot | null;
  map_node_id: number | null;
  facilities?: { id: number; name: string; quantity?: number | null; condition?: string | null }[];
}

// Titik rute dalam persen (0-100) dari backend.
export interface RoutePoint {
  x: number;
  y: number;
}

export interface RouteStep {
  type: string;
  index: number;
  title: string;
  path_index: number;
  point: RoutePoint;
  distance: number;
  description: string;
}

export interface RoutePlace {
  id: number | null;
  name: string | null;
  slug: string | null;
  point: RoutePoint | null;
}

// Respons /public/map/route (App\Http\Resources\MapRouteResource).
export interface MapRouteRecord {
  origin: RoutePlace;
  destination: RoutePlace;
  distance: number;
  estimated_minutes: number;
  path: RoutePoint[];
  via: unknown[];
  steps: RouteStep[];
}

// Bentuk rute yang dipakai komponen denah.
export interface DenahRoute {
  points: RoutePoint[];
  steps: RouteStep[];
  via: unknown[];
  origin: RoutePoint | null;
  dest: RoutePoint | null;
  originName?: string | null;
  destName?: string | null;
  info: { distance: number; minutes: number } | null;
}
