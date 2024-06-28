import axios from "axios";
import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import { useDispatch, useSelector } from "react-redux";
import { setInterestPlaces } from "../../redux/actions";
import Card_Interest_places from "./Card_Interest_places";
import { Link } from "react-router-dom";
import { Button, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import InfoPlace from "./InfoPlace";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';

export default function All_interest_places() {
  const dispatch = useDispatch();
  const reduxplaces = useSelector((state) => state.infotravels.interestPlaces);
  const [selectedPlace, setSelectedPlace] = useState(null); // State to handle the selected place
  const [showModal, setShowModal] = useState(false); // State to handle modal visibility

  useEffect(() => {
    axios("/api/interest-places")
      .then((res) => {
        dispatch(setInterestPlaces(res.data));
      })
      .catch((error) => {
        console.error("Error fetching travels:", error);
      });
  }, [dispatch]);

  const handleCardClick = (place) => {
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
  const [Km, setKm] = useState(0);

  return (
    <div className="my-2">
      <p className="my-2 fw-bold">Scopri i luoghi di interesse durante il tuo tragitto</p>
      <Form.Label className="mt-3 fw-bold">Km di distanza dal tragitto:</Form.Label>
      <Slider
        min={0}
        max={10}
        step={1}
        value={Km}
        onChange={(value) => setKm(value)}
        trackStyle={{ backgroundColor: '#86d3ff' }}
        handleStyle={{ borderColor: '#2693e6', backgroundColor: '#2693e6' }}
      />
      <p className='mb-0'>Km distanza:</p>
      <div className="fw-bold text-secondary mb-3">
        {Km === 0 ? 'Nessun filtro' : Km}
      </div>



      <Carousel responsive={responsive} className="">
        {reduxplaces &&
          reduxplaces.map((place, index) => (
            <div key={index} onClick={() => handleCardClick(place)}>
              <Card_Interest_places place={place} />
            </div>
          ))}
      </Carousel>
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
