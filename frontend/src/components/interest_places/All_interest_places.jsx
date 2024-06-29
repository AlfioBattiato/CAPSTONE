import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Carousel from 'react-multi-carousel';
import { setInterestPlaces } from '../../redux/actions';
import Card_Interest_places from './Card_Interest_places';
import { Form } from 'react-bootstrap';
import InfoPlace from './InfoPlace';
import InputSlider from 'react-input-slider';

// Haversine formula to calculate distance between two lat/lng points
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Filter function to filter interest places within max distance from the route
const filterInterestPlaces = (places, routeCoordinates, maxDistance) => {
  if (!Array.isArray(places) || !Array.isArray(routeCoordinates)) {
    console.error('Invalid data for filtering:', places, routeCoordinates);
    return [];
  }

  return places.filter((place) => {
    if (!place.lat || !place.lon) {
      console.error('Invalid place coordinates:', place);
      return false;
    }

    const isWithinDistance = routeCoordinates.some((coord) => {
      const distance = haversineDistance(coord.lat, coord.lng, place.lat, place.lon);
      return distance <= maxDistance;
    });

    return isWithinDistance;
  });


};

export default function All_interest_places() {
  const dispatch = useDispatch();
  const coordinates = useSelector((state) => state.infotravels.map_instructions.coordinates);
  // const reduxplaces = useSelector((state) => state.infotravels.interestPlaces || []);

  const [allplace, setAllplace] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [Km, setKm] = useState(0);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    axios('/api/interest-places')
      .then((res) => {
        setAllplace(res.data)
        dispatch(setInterestPlaces(res.data));
      })
      .catch((error) => {
        console.error('Error fetching interest places:', error);
      });
  }, []);

  useEffect(() => {
    if (allplace.length > 0 && coordinates?.length > 0) {
      const places = filterInterestPlaces(allplace, coordinates, Km);
      setFilteredPlaces(places);
    }
  }, [coordinates, Km]);

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
  const distanceMarks = [0, 2, 5, 10, 20, 50, 100];

  const mapIndexToKm = (index) => distanceMarks[index];
  const mapKmToIndex = (km) => distanceMarks.indexOf(km);

  return (
    <div className="my-2">
      <p className="my-2 fw-bold">Scopri i luoghi di interesse durante il tuo tragitto</p>
      <Form.Label className="mt-3 fw-bold d-block">Km di distanza dal tragitto:</Form.Label>
      <InputSlider
        axis="x"
        x={mapKmToIndex(Km)}
        xmin={0}
        xmax={distanceMarks.length - 1}
        xstep={1}
        onChange={({ x }) => setKm(mapIndexToKm(x))}
        styles={{
          track: {
            backgroundColor: '#86d3ff'
          },
          active: {
            backgroundColor: '#2693e6'
          },
          thumb: {
            width: 20,
            height: 20,
            backgroundColor: '#2693e6',
            border: '2px solid #2693e6'
          }
        }}
      />
      <p className='mb-0  ms-2'>Km distanza:</p>
      <div className="fw-bold text-secondary  mb-3">
        {Km === 0 ? 'Nessun tragitto impostato' : Km}
      </div>

      <Carousel responsive={responsive} className="">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place, index) => (
            <div key={index} onClick={() => handleCardClick(place)}>
              <Card_Interest_places place={place} />
            </div>
          ))
        ) : (
          <p>Nessun punto di interesse trovato nel raggio selezionato.</p>
        )}
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
