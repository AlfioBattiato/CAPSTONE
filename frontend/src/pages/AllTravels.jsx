import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function AllTravels() {

    const [travels, setTravels] = useState([]); // null buon candidato
    const navigate = useNavigate()
    useEffect(() => {
        axios('api/v1/travels')
            .then((res) => {
                setTravels(res.data)
                console.log(res.data)
            }
            );
    }, []);

    return (
        <div className="container-fluid m-0">

            <Row className='w-100'>
                <Col lg={3} className=' border-end  vh-100'>
                    <p>filter</p>
                </Col>
                <Col lg={9}>
                    <p>all user travel programming</p>
                    <Row>

                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default AllTravels;