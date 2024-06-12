import React from 'react'
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsFillPeopleFill } from "react-icons/bs";

export default function TravelCard(props) {
    const getImageSource = (vehicleType) => {
        switch (vehicleType) {
            case 'race bikes':
                return '/assets/moto.png';
            case 'motocross':
                return '/assets/motocross.png';
            case 'scooter':
                return '/assets/scooter.png';
            case 'off-road':
                return '/assets/fuoristrada.png';
            case 'harley':
                return '/assets/harley.png';
            default:
                return '/assets/moto.png';
        }
    };
    return (
        <Card className='p-2 m-1 bg-blue text-white ' style={{ width: "" }}>
            <Card.Body>
                {props.travel && (
                    <>
                        <Row>
                            <Col xs={8}>
                                <span>Partenza:</span>
                                <h3>{props.travel.start_location.toUpperCase()}</h3>
                                <div className="d-flex gap-2 flex-wrap justify-content-between">
                                    <div>

                                        <p className='m-0'>Data partenza</p>
                                        <Badge bg="light" text="dark">
                                            {props.travel.departure_date}
                                        </Badge>
                                        <hr />
                                        <p className='m-0'>Data arrivo</p>
                                        <Badge bg="light" text="dark">
                                            {props.travel.expiration_date}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className='m-0'>Tipologia moto:</p>
                                        <Badge bg="light" text="dark">
                                            {props.travel.type_moto}
                                        </Badge>
                                        <hr />
                                        <p className='m-0'>Cilindrata</p>
                                        <Badge bg="light" text="dark">
                                            {props.travel.cc_moto}
                                        </Badge>
                                    </div>



                                </div>



                            </Col>
                            <Col xs={4} >
                                <img src={getImageSource(props.travel.type_moto)} alt="mototype" className='img-fluid' style={{ width:"8rem"}} />
                            </Col>
                        </Row>
                        <hr />
                        <div className='mt-1'>
                            <p className='m-0'>Partecipanti Attuali:</p>
                            <BsFillPeopleFill className='me-2' />
                            <Badge bg="black" text="white">

                                {props.travel.users.length}
                            </Badge>

                        </div>

                    </>
                )}

            </Card.Body>
        </Card>
    )
}
