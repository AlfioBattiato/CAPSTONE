import Card from 'react-bootstrap/Card';

export default function Card_Interest_places({place}) {
  return (
    <Card className='rounded'style={{width:'90%',height:'8rem'}}>
        <img src={place.location_img} alt="img" style={{objectFit:'cover'}} className='rounded' />
      {/* <Card.Body>This is some text within a card body.</Card.Body> */}
    </Card>
  )
}
