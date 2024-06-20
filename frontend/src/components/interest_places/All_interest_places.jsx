import axios from "axios";
import { useEffect } from "react";
import Carousel from "react-multi-carousel";
import { useDispatch, useSelector } from "react-redux";
import { setInterestPlaces } from "../../redux/actions";
import Card_Interest_places from "./Card_Interest_places";
import { Link } from "react-router-dom";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";


export default function All_interest_places() {
    const dispatch = useDispatch();
    const reduxplaces = useSelector((state) => state.infotravels.interestPlaces)
    // const [places, setPlaces] = useState([])

    useEffect(() => {
        axios('/api/interest-places')
            .then((res) => {
                console.log(res)
                dispatch(setInterestPlaces(res.data))
                // setPlaces(res.data)
            })
            .catch((error) => {
                console.error('Error fetching travels:', error);
            });
    }, []);



    // useEffect(() => { }, [places])
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1400 },
            items: 6,
            slidesToSlide: 6
        },
        desktop: {
            breakpoint: { max: 1400, min: 900 },
            items: 4,
            slidesToSlide: 3
        },
        tablet: {
            breakpoint: { max: 900, min: 555 },
            items: 3,
            slidesToSlide: 2
        },
        mobile: {
            breakpoint: { max: 555, min: 0 },
            items: 2,
            slidesToSlide: 2
        }
    };

    return (
        <div className="my-2 ">
    


            <p className="mb-0"> Scopri i luoghi di interesse</p>
            <Carousel responsive={responsive} className="">
                {reduxplaces && (
                    reduxplaces.map((place, index) => (
                        <Card_Interest_places place={place} key={index} />
                    ))
                )}
            </Carousel>

            <Link to="/createInterestPlace" className="me-2">
                <Button variant="outline-dark" className="my-3">Crea nuovo punto di interesse</Button>
            </Link>
            <OverlayTrigger
                placement="right"
             
                overlay={
                    <Tooltip id="tooltip-help">
                        Aiuta gli altri utenti a scoprire nuovi luoghi da visitare
                    </Tooltip>
                }
            >
                <span style={{ cursor: 'pointer' }}className="fw-bold">?</span>
            </OverlayTrigger>
        </div>
    );
}

