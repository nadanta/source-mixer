import React from 'react';
import '../styles/navmenu.css';

export default function NavMenu({ active, setActive }) {
  return (
    <div className="nav-menu">
      <button className={active === '4osc' ? 'active' : ''} onClick={() => setActive('4osc')}>4 OSC</button>
      <button className={active === 'noise' ? 'active' : ''} onClick={() => setActive('noise')}>NOISE</button>
    </div>
  );
}
