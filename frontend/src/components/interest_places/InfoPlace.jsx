import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { SlLike } from "react-icons/sl";
import { BiSolidLike } from "react-icons/bi";
import { FcLike } from "react-icons/fc";
import { setCurrentTravel, setMetas } from "../../redux/actions";


export default function InfoPlace({ show, handleClose, place }) {
    const dispatch = useDispatch()
    const travel = useSelector((state) => state.infotravels.setTravel);
    const infotravels = useSelector((state) => state.infotravels);


    const submit = () => {
        const updatedMetas = [
            ...infotravels.metas,
            {
                city: place.name_location ? place.name_location : "Punto di interesse",
                lat: parseFloat(place.lat),
                lon: parseFloat(place.lon)
            }
        ];
        dispatch(setMetas(updatedMetas));
    
        console.log('ottimo');
        handleClose();
    }
    return (
        <Modal show={show} onHide={handleClose} className="infoPlace" >
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title >{place.name_location ? place.name_location : "Nome luogo sconosciuto"} </Modal.Title>

            </Modal.Header>
            <Modal.Body className="bg-dark text-white text-center">
                <div className="d-flex justify-content-end gap-2 align-items-center mb-3">
                    <p className="mb-0">Questo luogo ha ricevuto</p>
                    <p className="mb-0">{place.rating}</p>
                    <FcLike />
                </div>
                <img src={place.location_img} alt={place.name_location} style={{ width: '15rem' }} className="rounded" />
                <p className="mt-4 fw-bold">Note aggiuntive:</p>
                <p className="mt-4">{place.description ? place.description : "Nessuna nota disponibile"}</p>
                <hr />
                <div className="d-flex align-items-center justify-content-end gap-2 p-1 placelike" onClick={() => submit}>

                    <SlLike />
                    <p className="mb-0"> Lascia un like</p>



                </div>

            </Modal.Body>
            <Modal.Footer className="bg-dark">
                <Button variant="outline-light" className="rounded-pill" onClick={submit}>
                    Aggiungi meta
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
