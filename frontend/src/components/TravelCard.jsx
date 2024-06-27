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
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    return (
        <Col  md={4} lg={3}>
            <Card className='bg-white text-dark mb-2 shadow-sm travelCard ' style={{ width: "" }}>
                <Card.Body>
                    {props.travel && (
                        <>
                            <img src={getImageSource(props.travel.type_moto)} alt="mototype" className='img-fluid d-block' style={{ width: "48px", height: '48px', objectFit: "contain" }} />
                            <h3 className=' ms-2 '>{props.travel.start_location.toUpperCase()}</h3>
                            <div className='d-flex flex-wrap gap-2'>
                                <BsCalendarDate className='me-1 text-warning' />
                                <p className='fs-12 fw-bold me-2 mb-0'>
                                    {formatDate(props.travel.departure_date)}
                                </p>
                            </div>

                            <div className="d-flex flex-wrap mt-2 gap-2">
                                <Badge bg="dark" text="white">
                                    {props.travel.type_moto}
                                </Badge>
                                <Badge bg="dark" text="white">
                                    Cc: {props.travel.cc_moto}
                                </Badge>
                            </div>

                            <p className='m-0 fs-12 text-secondary'>Partecipanti attuali:</p>
                            <BsFillPeopleFill className='me-2 text-success' />
                            <Badge bg="light" text="dark">

                                {props.travel.users.length}
                            </Badge>




                            <Link to={`/infoTravel/${props.travel.id}`} className="nav-link fs-6">
                                    <Button className='btn-blue-dark fw-bold border-0 ms-auto' >Vedi viaggio <FaArrowRight /></Button>
                                </Link>
                       
                </>
                    )}

            </Card.Body>
        </Card>
        </Col >
    )
}
