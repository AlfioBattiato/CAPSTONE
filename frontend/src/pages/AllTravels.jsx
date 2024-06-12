import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setTravels } from '../redux/actions';
// import Card from 'react-bootstrap/Card';
// import Badge from 'react-bootstrap/Badge';
// import { BsFillPeopleFill } from "react-icons/bs";
import TravelCard from '../components/TravelCard';

function AllTravels() {
    const navigate = useNavigate();
    const alltravel = useSelector((state) => state.infotravels.travels);
    const dispatch = useDispatch();

    //funzione per cambio immagine moto


    useEffect(() => {
        axios('api/v1/travels')
            .then((res) => {
                dispatch(setTravels(res.data));
                console.log(res.data);
            })
            .catch((error) => {
                console.error('Error fetching travels:', error);
            });
    }, [dispatch]);

    return (
        <div className="container-fluid m-0">
            <Row className='w-100'>
                <Col md={3} className='border-end vh-100'>
                    <p>filter</p>
                </Col>
                <Col md={7}>
                    <h2 className='py-5'>Viaggi programmati da altri utenti</h2>
                    <Row>


                        {alltravel && alltravel.length > 0 ? (
                            alltravel.map((travel, index) => (
                                <Col xs={6}>
                                    <TravelCard key={index} travel={travel}></TravelCard>
                                </Col>
                            ))
                        ) : (
                            <p>No match found</p>
                        )}
                    </Row>
                </Col>
                <Col md={2} className='border-start vh-100'>
                    <p>sponsor</p>
                </Col>
            </Row>
        </div >
    );
}

export default AllTravels;
