import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setTravels } from "../redux/actions";
import TravelCard from "../components/TravelCard";
import Sponsor from "../components/Sponsor";
import FilterTravel from "../components/FilterTravel";
import Pagination from "react-bootstrap/Pagination";

function AllTravels() {
  const allTravels = useSelector((state) => state.infotravels.travels);
  const filters = useSelector((state) => state.infotravels.filters);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const travelsPerPage = 5;

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filters.startDate) queryParams.append("start_date", filters.startDate);
        if (filters.city) queryParams.append("city", filters.city);
        if (filters.cc) queryParams.append("cc", filters.cc);
        if (filters.participants) queryParams.append("participants", filters.participants);
        if (filters.days) queryParams.append("days", filters.days);

        // This ensures that only the selected types are sent
        const types = Object.keys(filters.types).filter((type) => filters.types[type]);
        if (types.length) queryParams.append("types", types.join(","));

        const res = await axios.get(`api/v1/travels?${queryParams.toString()}`);
        dispatch(setTravels(res.data));
      } catch (error) {
        console.error("Error fetching travels:", error);
      }
    };

    fetchTravels();
  }, [dispatch, filters]);

  const indexOfLastTravel = currentPage * travelsPerPage;
  const indexOfFirstTravel = indexOfLastTravel - travelsPerPage;
  const currentTravels = allTravels.slice(indexOfFirstTravel, indexOfLastTravel);
  const totalPages = Math.ceil(allTravels.length / travelsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <Row>
        <Col md={3} className="border-end">
          <h5 className="mt-2">Filtri di ricerca</h5>
          <FilterTravel />
        </Col>
        <Col md={7}>
          <h5 className="my-2 pb-2">Viaggi programmati da altri utenti</h5>
          <p className="text-primary">
            {currentPage} di {totalPages} pagine
          </p>

          {currentTravels && currentTravels.length > 0 ? (
            currentTravels.map((travel, index) => <TravelCard key={index} travel={travel} />)
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
            <Pagination.Next
              onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
            />
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
