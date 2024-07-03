import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TravelCard from "../components/card/TravelCard";
import FilterTravel from "../components/FilterTravel";
import Pagination from "react-bootstrap/Pagination";

function AllTravels() {
  const [travels, setTravels] = useState([]);
  const [activeTravels, setActiveTravels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const travelsPerPage = 16; // Numero di viaggi per pagina
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scroll(0, 0);
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * travelsPerPage;
    const endIndex = startIndex + travelsPerPage;
    setActiveTravels(travels.slice(startIndex, endIndex));
  }, [travels, currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(travels.length / travelsPerPage));
    setCurrentPage(1);
  }, [travels]);

  return (
    <div className="container-fluid d-flex flex-column min-vh-100 pb-3">
      <Row className="">
        <Col md={3} className="border-end">
          <h5 className="mt-2 ms-5">Filtri di ricerca</h5>
          <FilterTravel setTravels={setTravels} />
        </Col>
        <Col md={9} className="d-flex flex-column">
          <h5 className="my-2 pb-2">Viaggi programmati da altri utenti</h5>

          <Row className="gy-3 flex-grow-1">
            {activeTravels && activeTravels.length > 0 ? (
              activeTravels.map((travel, index) => (
                <Col key={index} xs={12} sm={6} lg={4} xl={3}>
                  <TravelCard travel={travel} showParticipants={true} />
                </Col>
              ))
            ) : (
              <p>No match found</p>
            )}
          </Row>

          <div className="mt-auto">
            <div className="d-flex justify-content-between flex-wrap align-items-center">
              <p className="text-dark mb-0">
                Pagina {currentPage} di {totalPages}
              </p>
              <Pagination className="justify-content-center m-0 mt-4 mb-2 ">
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
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} />
              </Pagination>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default AllTravels;
