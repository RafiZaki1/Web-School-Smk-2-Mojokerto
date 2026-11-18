'use client';

import { CAMPUS_BUILDINGS } from '../data/campus';
import { Building } from './Building';
import { RoutePath } from './RoutePath';

export function Campus() {
  return (
    <group>
      {CAMPUS_BUILDINGS.map((building) => (
        <Building key={building.id} building={building} />
      ))}
      <RoutePath />
    </group>
  );
}
