import { useEffect, useState, useCallback, useRef } from "react";
import './App.css';
import { Movie } from "./type/type"
import Card from "./Components/Card"
import CardLoader from "./Components/CardLoader"
import { CONSTANT } from "./constant/Constant"
import "bootstrap/dist/css/bootstrap.css";
import ImdbLogo from './img/imdb';
import IconArrowUp from './img/arrow-up';
import IconArrowDown from './img/arrow-down';
import { Container, Navbar, Button, Dropdown, Row, Col, OverlayTrigger, Tooltip, DropdownButton } from 'react-bootstrap'
import { observer } from "mobx-react-lite";
import moviesStore from "./app/store";

const App = observer(() => {
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const [sorting, setSorting] = useState(0);
  const [sortdirection, setSortdirection] = useState(0);
  const [title, setTitle] = useState("Ranking");

  useEffect(() => {
    setCount(10);
    moviesStore.fetchMovies(CONSTANT.proxyUrl + CONSTANT.baseApi + CONSTANT.sorting[sorting] + CONSTANT.sortdirection[sortdirection]);
  }, [sorting, sortdirection]);

  const handleScroll = useCallback(() => {
    if (
      moviesStore.data && count < moviesStore.data.itemListElement.length && !loadingRef.current && window.innerHeight + window.scrollY >= document.body.scrollHeight - 20
    ) {
      loadingRef.current = true;
      setLoading(true);
      setTimeout(() => {
        setCount(prevCount => prevCount + 10);
        setLoading(false);
        loadingRef.current = false;
      }, 1000); 
    }
  }, [count, moviesStore.data]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      {moviesStore.dataloading && (
        <Container className="d-flex align-items-center justify-content-center min-height-100vh">
          <CardLoader />
        </Container>
      )}
      {moviesStore.data &&(
        <>
          <Navbar className="d-flex align-items-center justify-content-center">
            <Navbar.Brand className="d-flex align-items-center justify-content-center">
              <ImdbLogo></ImdbLogo>
              <Container className = "otstuplogotext">Top 250 IMDb movies</Container>
            </Navbar.Brand>
          </Navbar>
          <Container className="otstupsort">
            <Row className="g-1">
              <Col md="auto">
                <DropdownButton id="dropdown-basic-button" title={title} data-testid = "dropdown">
                  <Dropdown.Item 
                  onClick={() => {setTitle("Ranking"); setSorting(0)}}
                  data-testid = "ranking"
                  >
                    Ranking
                  </Dropdown.Item>
                  <Dropdown.Item 
                  onClick={() => {setTitle("IMDb rating"); setSorting(1)}}
                  data-testid = "rating"
                  >
                    IMDb rating
                  </Dropdown.Item>
                  <Dropdown.Item 
                  onClick={() => {setTitle("Alphabetical"); setSorting(2)}}
                  data-testid = "alphabetical"
                  >
                    Alphabetical
                  </Dropdown.Item>
                  <Dropdown.Item 
                  onClick={() => {setTitle("Popularity"); setSorting(3)}}
                  data-testid = "popularity"
                  >
                    Popularity
                  </Dropdown.Item>
                </DropdownButton>
              </Col>
              <Col md="auto">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="button-tooltip">Change sort by direction</Tooltip>}
                >
                  <Button 
                  className="d-flex align-items-center justify-content-center" 
                  onClick={() => setSortdirection(sortdirection => 1-sortdirection)}
                  data-testid = "changedirection"
                  >
                    {sortdirection == 0 ? (<IconArrowUp></IconArrowUp>) : (<IconArrowDown></IconArrowDown>)}
                  </Button>
                </OverlayTrigger>
              </Col>
            </Row>
          </Container>
          {moviesStore.data.itemListElement.slice(0,Math.min(count, moviesStore.data.itemListElement.length)).map((movie: Movie, index: number) => (
            <Card
            key={index}
            name={movie.item.name}
            image={movie.item.image}
            rating={movie.item.aggregateRating.ratingValue}
            contentRating={movie.item.contentRating}
            genre={movie.item.genre}
            url={movie.item.url}
            id={index}
            />
          ))}
        </>
      )}
      {moviesStore.data && loading && (
        <Container className="d-flex align-items-center justify-content-center">
          <CardLoader />
        </Container>
      )}
      {moviesStore.data && count < moviesStore.data.itemListElement.length && !loading && (
        <Container className = "empty"></Container>
      )}
    </>
  );
})

export default App;