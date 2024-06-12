import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setTravels } from '../redux/actions';
import TravelCard from '../components/TravelCard';
import Sponsor from '../components/Sponsor';
import FilterTravel from '../components/FilterTravel';
import Pagination from 'react-bootstrap/Pagination';

function AllTravels() {
    // const navigate = useNavigate();
    const alltravel = useSelector((state) => state.infotravels.travels);
    const dispatch = useDispatch();
    const [filter, setFilter] = useState([]);


    useEffect(() => {
        axios('api/v1/travels')
            .then((res) => {
                dispatch(setTravels(res.data));
                setFilter(res.data)
                // console.log(res.data);
            })
            .catch((error) => {
                console.error('Error fetching travels:', error);
            });
    }, [dispatch]);

    const [currentPage, setCurrentPage] = useState(1);
    const travelsPerPage = 5;
    const indexOfLastTravel = currentPage * travelsPerPage;
    const indexOfFirstTravel = indexOfLastTravel - travelsPerPage;
    const currentTravels = filter.slice(indexOfFirstTravel, indexOfLastTravel);
    const totalPages = Math.ceil(filter.length / travelsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container">
            <Row>
                <Col md={3} className='border-end'>
                    <h5 className='mt-2'>Filtri di ricerca</h5>
                    <FilterTravel />
                </Col>
                <Col md={7} >
                    <h5 className='my-2 pb-2'>Viaggi programmati da altri utenti</h5>
                    <p className='text-primary'>{currentPage} di {totalPages} pagine</p>

                    {currentTravels && currentTravels.length > 0 ? (
                        currentTravels.map((travel, index) => (
                            <TravelCard key={index} travel={travel} />
                        ))
                    ) : (
                        <p>No match found</p>
                    )}

                    {/* Pagina */}
                    <Pagination className="justify-content-center mt-4">
                        <Pagination.First onClick={() => handlePageChange(1)} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)} />
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
                    </Pagination>
                </Col>
                <Col md={2} className='border-start'>
                    <h5 className='mt-2'>I nostri partner</h5>
                    <Sponsor />
                </Col>
            </Row>
        </div>
    );
}

export default AllTravels;
