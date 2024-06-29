import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import { BsFillPeopleFill } from "react-icons/bs";
import { BsCalendarDate } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import './travelcard.css'
import { SiGooglemaps } from "react-icons/si";
import { useEffect } from 'react';

export default function TravelCard(props) {
    const getImageSource = (vehicleType) => {
        switch (vehicleType) {
            case 'Race Bikes':
                return '/assets/moto/moto3.png';
            case 'racebikes':
                return '/assets/moto/moto3.png';
            case 'Motocross':
                return '/assets/moto/motocross3.png';
            case 'Scooter':
                return '/assets/moto/vespa3.png';
            case 'scooter':
                return '/assets/moto/vespa3.png';
            case 'Off Road':
                return '/assets/moto/offroad3.png';
            case 'Harley':
                return '/assets/moto/harley3.png';
            default:
                return '/assets/moto/moto.png';
        }
    };
    const navigate = useNavigate()
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    // useEffect(()=>{console.log(props.travel)})
    return (
        <Col xs={12} sm={6} lg={4} xl={3}>
            <div className='cardTravel position-relative' style={{ width: "" }}>

                {props.travel && (
                    <>
                    <div className='d-flex justify-content-end '>
                        <img src={getImageSource(props.travel.type_moto)} alt="mototype" className='img-fluid d-block' style={{ width: "70px", height: '70px', objectFit: "contain" }} />

                    </div>
                        <div className="d-flex gap-2 align-items-center my-3 start-25 top-0 position-absolute">
                            <SiGooglemaps className='text-danger' />
                            <p className='fw-bold mb-0 '>{props.travel.start_location}</p>
                        </div>
                        <div className='d-flex flex-wrap gap-2'>
                            <BsCalendarDate className='me-1' />
                            <p className='fs-12 fw-bold me-2 mb-0'>
                                {formatDate(props.travel.departure_date)}
                            </p>
                        </div>

                        <div className="d-flex flex-column mt-2 gap-1">
                            <div>

                                <Badge bg="dark" text="white">
                                    {props.travel.type_moto}
                                </Badge>
                            </div>
                            <div>

                                <Badge bg="dark" text="white">
                                    Cc: {props.travel.cc_moto}
                                </Badge>
                            </div>
                        </div>

                        <p className='m-0 fs-12 text-secondary'>Partecipanti attuali:</p>
                        <BsFillPeopleFill className='me-2 text-success' />
                        <Badge bg="light" text="dark">

                            {props.travel.users.filter(user => user.pivot.active === 1).length}
                        </Badge>
                        <button className='cardTravel-button' onClick={() => navigate(`/infoTravel/${props.travel.id}`)} >Vedi</button>

                    </>
                )}


            </div>
        </Col >
    )
}
