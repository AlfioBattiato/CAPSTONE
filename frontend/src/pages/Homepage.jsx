import { Col, Row } from 'react-bootstrap';
import SetTravel from '../components/maps/SetCityTravel';
import Maps from '../components/maps/Maps';
import SetTravelSettings from '../components/maps/SetTravelSettings';
import RouteInstructions from '../components/maps/RouteInstructions ';


function Homepage() {
   

    return (
        <div className="container-fluid">
           
            <Row className='mt-3'>
                <Col md={3} className="border-end">
                    <h5 className="mt-2">Organizza il percorso per il tuo viaggio</h5>
                  <SetTravel></SetTravel>
                    <SetTravelSettings></SetTravelSettings>
                </Col>
                <Col md={7}>
                    <h5 className="my-2 pb-2">maps</h5>
                    <Maps></Maps>
                </Col>
                <Col md={2} className="border-start">
                <RouteInstructions />
                </Col>
            </Row>
        </div>
    );
}

export default Homepage;
