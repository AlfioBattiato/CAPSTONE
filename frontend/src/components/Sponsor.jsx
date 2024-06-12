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
        <Card key={index} className='mb-2' style={{ width: '18rem' }}>
              <img src={sponsor} alt="sponsor" className='img-fluid' style={{ width: "100%" }} />
            {/* <Card.Link href="#">Another Link</Card.Link> */}
        </Card>
      ))}
    </>
  );
}
