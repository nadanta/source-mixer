// File: src/components/PlateContainer.jsx
import React, { useState } from 'react';
import FourOscPlate from './FourOscPlate';
import NoisePlate from './NoisePlate';
import NaturalSoundsPlate from './NaturalSoundsPlate';
import NavMenu from './NavMenu';
import Header from './Header';
import GlobalVisualizer from './GlobalVisualizer'; // ✅

export default function PlateContainer() {
  const [active, setActive] = useState('4osc');

  const renderPlate = () => {
    switch (active) {
      case '4osc':
        return <FourOscPlate />;
      case 'noise':
        return <NoisePlate />;
      case 'natural':
        return <NaturalSoundsPlate />;
      default:
        return <div>Select a Plate</div>;
    }
  };

  return (
    <div>
      <Header />
      <NavMenu active={active} setActive={setActive} />
      {renderPlate()}
      <GlobalVisualizer /> {/* ✅ Attach global visualizer at the bottom */}
    </div>
  );
}
