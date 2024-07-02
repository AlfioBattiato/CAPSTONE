import React from 'react';
import Card from 'react-bootstrap/Card';

export default function Sponsor() {
  const sponsors = [
    '/assets/sponsor/sponsor1.gif', 
    '/assets/sponsor/sponsor2.jpg', 
    '/assets/sponsor/sponsor3.gif' 
  ];

  return (
    <>
      {sponsors.map((sponsor, index) => (
        <div key={index} className='mb-2 overflow-hidden rounded border bg-white' style={{ width: '50%' }}>
              <img src={sponsor} alt="sponsor" className='img-fluid'  />
            {/* <a href="">Another Link</a> */}
        </div>
      ))}
    </>
  );
}
