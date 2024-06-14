import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TravelCard from '../components/TravelCard';
import Sponsor from '../components/Sponsor';
import FilterTravel from '../components/FilterTravel';
import Pagination from 'react-bootstrap/Pagination';

function AllTravels() {
    const [travels, setTravels] = useState([]);
    const [activeTravels, setActiveTravels] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const travelsPerPage = 5; // Numero di viaggi per pagina
    const [totalPages, setTotalPages] = useState(0);

    // Funzione per gestire il cambio di pagina
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Effetto per impostare i viaggi visualizzati sulla pagina corrente
    useEffect(() => {
        const startIndex = (currentPage - 1) * travelsPerPage;
        const endIndex = startIndex + travelsPerPage;
        setActiveTravels(travels.slice(startIndex, endIndex));
        
    }, [travels, currentPage]);

    // Effetto per calcolare il numero totale di pagine
    useEffect(() => {
        setTotalPages(Math.ceil(travels.length / travelsPerPage));
        setCurrentPage(1)
    }, [travels]);

    return (
        <div className="container">
            <Row>
                <Col md={3} className="border-end">
                    <h5 className="mt-2">Filtri di ricerca</h5>
                    <FilterTravel setTravels={setTravels} />
                </Col>
                <Col md={7}>
                    <h5 className="my-2 pb-2">Viaggi programmati da altri utenti</h5>
                    <p className="text-primary">Pagina {currentPage} di {totalPages}</p>
                    {activeTravels && activeTravels.length > 0 ? (
                        activeTravels.map((travel, index) => (
                            <TravelCard key={index} travel={travel} />
                        ))
                    ) : (
                        <p>No match found</p>
                    )}
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
                <Col md={2} className="border-start">
                    <h5 className="mt-2">I nostri partner</h5>
                    <Sponsor />
                </Col>
            </Row>
        </div>
    );
}

export default AllTravels;
