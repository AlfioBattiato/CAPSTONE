import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import { BsFillPeopleFill } from "react-icons/bs";
import { BsCalendarDate } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import './travelcard.css'
import { SiGooglemaps } from "react-icons/si";

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
    const navigate = useNavigate()
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    return (
        <Col xs={6} lg={4} xl={3}>
            <div className='cardTravel' style={{ width: "" }}>

                {props.travel && (
                    <>
                        <img src={getImageSource(props.travel.type_moto)} alt="mototype" className='img-fluid d-block' style={{ width: "48px", height: '48px', objectFit: "contain" }} />
                        <div className="d-flex gap-2 align-items-center my-3">
                            <SiGooglemaps className='text-danger' />
                            <p className='fw-bold mb-0 '>{props.travel.start_location.toUpperCase()}</p>
                        </div>
                        <div className='d-flex flex-wrap gap-2'>
                            <BsCalendarDate className='me-1' />
                            <p className='fs-12 fw-bold me-2 mb-0'>
                                {formatDate(props.travel.departure_date)}
                            </p>
                        </div>

                        <div className="d-flex mt-2 gap-2">
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
                        <button className='cardTravel-button' onClick={() => navigate(`/infoTravel/${props.travel.id}`)} >Vedi</button>

                    </>
                )}


            </div>
        </Col >
    )
}
