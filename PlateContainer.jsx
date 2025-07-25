import React, { useState } from 'react';
import FourOscPlate from './FourOscPlate'; // You must create/import this
import NoisePlate from './NoisePlate';
import NavMenu from './NavMenu';

export default function PlateContainer() {
  const [activePlate, setActivePlate] = useState('4osc');
  return (
    <div className="plate-wrapper">
      <NavMenu active={activePlate} setActive={setActivePlate} />
      {activePlate === '4osc' && <FourOscPlate />}
      {activePlate === 'noise' && <NoisePlate />}
    </div>
  );
}
