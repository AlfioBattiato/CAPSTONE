import React from 'react'
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsFillPeopleFill } from "react-icons/bs";
import { PiMotorcycleFill } from "react-icons/pi";
import { BsCalendarDate } from "react-icons/bs";
import { Button } from 'react-bootstrap';
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function TravelCard(props) {
    const getImageSource = (vehicleType) => {
        switch (vehicleType) {
            case 'racebikes':
                return '/assets/moto2.png';
            case 'motocross':
                return '/assets/motocross1.png';
            case 'scooter':
                return '/assets/vespa.png';
            case 'offroad':
                return '/assets/motocross1.png';
            case 'harley':
                return '/assets/harley2.png';
            default:
                return '/assets/moto.png';
        }
    };
    return (
        <Card className='bg-white text-dark mb-2 shadow-sm travelCard ' style={{ width: "" }}>
            <Card.Body>
                {props.travel && (
                    <>
                        <Row >
                            <Col xs={12}>
                                <Row >
                                    <Col md={8}>
                                        <span className='text-secondary fs-12 fw-semi-bold'>Partenza:</span>
                                        <h5 className=' ms-2 '>{props.travel.start_location.toUpperCase()}</h5>
                                        <div className='d-flex justify-content-center align-items-center h-50'>
                                            {/* <p className='m-0'>Data partenza</p> */}
                                            <BsCalendarDate className='me-1 text-warning' />
                                            <p className='fs-12 fw-bold me-2 mb-0'>
                                                {props.travel.departure_date}
                                            </p>


                                            <span className='line'></span>
                                            <PiMotorcycleFill className='ms-2' />
                                            <BsCalendarDate className='ms-3 text-success' />
                                            <h6 className='fw-bold fs-12 ms-1 mb-0'>
                                                {props.travel.expiration_date}
                                            </h6>
                                        </div>


                                    </Col>
                                    <Col md={4}>
                                        <img src={getImageSource(props.travel.type_moto)} alt="mototype" className='img-fluid d-block' style={{ width: "48px", height: '48px', objectFit: "contain" }} />

                                        <span className='me-1 fs-12'>Tipologia moto:</span>
                                        <Badge bg="light" text="dark">
                                            {props.travel.type_moto}
                                        </Badge>
                                        <hr />
                                        <span className='me-1 fs-12'>MIN Cilindrata</span>
                                        <Badge bg="light" text="dark">
                                            {props.travel.cc_moto}
                                        </Badge>

                                    </Col>
                                    <hr className='my-1' />
                                    <Col xs={6}>
                                        <p className='m-0 fs-12 text-secondary'>Partecipanti attuali:</p>
                                        <BsFillPeopleFill className='me-2 text-success' />
                                        <Badge bg="light" text="dark">

                                            {props.travel.users.length}
                                        </Badge>
                                    </Col>
                                    <Col xs={6} className='d-flex justify-content-center  align-items-center'>
                                        <Link to={`/infoTravel/${props.travel.id}`} className="nav-link fs-6">
                                            <Button className='btn-blue-dark fw-bold border-0 ms-auto' >Vedi viaggio <FaArrowRight /></Button>
                                        </Link>

                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </>
                )}

            </Card.Body>
        </Card>
    )
}
