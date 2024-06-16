import { Col, Row } from 'react-bootstrap';
import SetTravel from '../components/SetTravel';
import Maps from '../components/Maps';


function Homepage() {
   

    return (
        <div className="container">
           
            <Row className='mt-3'>
                <Col md={4} className="border-end">
                    <h5 className="mt-2">Organizza il percorso per il tuo viaggio</h5>
                  <SetTravel></SetTravel>
                </Col>
                <Col md={8}>
                    <h5 className="my-2 pb-2">maps</h5>
                    <Maps></Maps>
                </Col>
                {/* <Col md={2} className="border-start">
                   
                </Col> */}
            </Row>
        </div>
    );
}

export default Homepage;
