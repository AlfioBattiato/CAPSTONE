import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setTravels } from '../redux/actions';

function AllTravels() {
    const navigate = useNavigate();
    const alltravel = useSelector((state) => state.infotravels.travels);
    const dispatch = useDispatch();

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
                <Col md={2} className='border-end vh-100'>
                    <p>filter</p>
                </Col>
                <Col md={10}>
                    <p>all user travel programming</p>
                    <Row className='px-2 mb-2'>
                        <Col md={2} className='border'>Start location</Col>
                        <Col md={2} className='border'>Moto Type</Col>
                        <Col md={2} className='border'>Cc Moto</Col>
                        <Col md={2} className='border'>Departure</Col>
                        <Col md={2} className='border'>Arrive</Col>
                    </Row>
                    {alltravel && alltravel.length > 0 ? (
                        alltravel.map((travel, index) => (
                            <Row key={index} className='px-2'>


                                <Col md={2} className='border'>{travel.start_location}</Col>
                                <Col md={2} className='border'>{travel.type_moto}</Col>
                                <Col md={2} className='border'>{travel.cc_moto}</Col>
                                <Col md={2} className='border'>{travel.departure_date}</Col>
                                <Col md={2} className='border'>{travel.expiration_date}</Col>
                                <Col md={2} className='border'>info</Col>
                                {/* <Col md={2} className='border'>{travel.user}</Col> */}

                            </Row>
                        ))
                    ) : (
                        <p>No match found</p>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default AllTravels;
