import axios from "axios";
import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import { useDispatch, useSelector } from "react-redux";
import { setInterestPlaces } from "../../redux/actions";
import Card_Interest_places from "./Card_Interest_places";
import { Link } from "react-router-dom";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import InfoPlace from "./InfoPlace";

export default function All_interest_places() {
  const dispatch = useDispatch();
  const reduxplaces = useSelector((state) => state.infotravels.interestPlaces);
  const [selectedPlace, setSelectedPlace] = useState(null); // State to handle the selected place
  const [showModal, setShowModal] = useState(false); // State to handle modal visibility

  useEffect(() => {
    axios("/api/interest-places")
      .then((res) => {
        // console.log(res);
        dispatch(setInterestPlaces(res.data));
      })
      .catch((error) => {
        console.error("Error fetching travels:", error);
      });
  }, [dispatch]);

  const handleCardClick = (place) => {
    // console.log(place)
    setSelectedPlace(place);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlace(null);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1400 },
      items: 6,
      slidesToSlide: 6,
    },
    desktop: {
      breakpoint: { max: 1400, min: 900 },
      items: 4,
      slidesToSlide: 3,
    },
    tablet: {
      breakpoint: { max: 900, min: 555 },
      items: 3,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 555, min: 0 },
      items: 2,
      slidesToSlide: 2,
    },
  };

  return (
    <div className="my-2 ">
      <p className="my-2 fw-bold">Scopri i luoghi di interesse</p>
      <Carousel responsive={responsive} className="">
        {reduxplaces &&
          reduxplaces.map((place, index) => (
            <div key={index} onClick={() => handleCardClick(place)}>
              <Card_Interest_places place={place} />
            </div>
          ))}
      </Carousel>

      <Link to="/createInterestPlace" className="me-2">
        <Button variant="outline-dark" className="my-3">
          Crea nuovo punto di interesse
        </Button>
      </Link>
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip id="tooltip-help">
            Aiuta gli altri utenti a scoprire nuovi luoghi da visitare
          </Tooltip>
        }
      >
        <span style={{ cursor: "pointer" }} className="fw-bold">
          ?
        </span>
      </OverlayTrigger>

      {selectedPlace && (
        <InfoPlace
          show={showModal}
          handleClose={handleCloseModal}
          place={selectedPlace}
        />
      )}
    </div>
  );
}
