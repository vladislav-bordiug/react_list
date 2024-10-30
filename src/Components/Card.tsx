import {useEffect} from "react";
import { Container, Button, Row, Col, Form } from 'react-bootstrap';
import { useState } from "react";
import IconPencil from '../img/pencil';
import IconSave from '../img/save';
import IconCross1 from '../img/cross';
import { observer } from "mobx-react-lite";
import moviesStore from "../app/store";

interface CardProps {
    name: string;
    image: string;
    rating: number;
    contentRating: string;
    genre: string;
    url: string;
    id: number,
}

const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

const Card: React.FC<CardProps> = observer(({ name, image, rating, contentRating, genre, url, id }) => {
    name = decodeHtml(name);
    genre = decodeHtml(genre);
    const [editing, setEditing] = useState(0);
    const [namevalue, setNamevalue] = useState(name);
    const [genrevalue, setGenrevalue] = useState(genre);
    useEffect(() => {
        setEditing(0);
        setNamevalue(name);
        setGenrevalue(genre);
    }, [name, genre]);
    return (
        <Container className="border" data-testid = "card">
            <Row className="otstup">
                <Col md={2} sm={2} className="d-flex align-items-center justify-content-center">
                    <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    style={{
                        width: "auto",
                        height: "150px",
                        borderRadius: "8px",
                        display: "block",
                    }}
                    />
                </Col>
                <Col md={3} sm={3} className="d-flex align-items-center justify-content-center">
                    {editing == 0 ? (<h4 className="text-center">{name}</h4>) 
                    : (<Form>
                        <Form.Control 
                          type="text" 
                          onChange={(e) => setNamevalue(e.target.value)} 
                          value={namevalue}
                          data-testid="inputname"
                        />
                        </Form>)
                    }
                </Col>
                <Col md={1} sm={1} className="d-flex align-items-center justify-content-center">
                    <h4>{rating}</h4>
                </Col>
                <Col md={1} sm={1} className="d-flex align-items-center justify-content-center">
                    <h4>{contentRating}</h4>
                </Col>
                <Col md={2} sm={2} className="d-flex align-items-center justify-content-center">
                    {editing == 0 ? (<h4 className="text-center">{genre}</h4>) 
                    : (<Form>
                        <Form.Control 
                          type="text" 
                          onChange={(e) => setGenrevalue(e.target.value)} 
                          value={genrevalue}
                          data-testid="inputgenre"
                        />
                        </Form>)
                    }
                </Col>
                <Col md={1} sm={1} className="d-flex align-items-center justify-content-center">
                    <Button href={url} target="_blank" variant="primary">IMDb</Button>{' '}
                </Col>
                <Col md={1} sm={1} className="d-flex align-items-center justify-content-center">
                    <Button
                    className="d-flex align-items-center justify-content-center" 
                    onClick={() => {setEditing(1-editing);moviesStore.changeItem(id, namevalue, genrevalue)}}
                    data-testid = "change"
                    >
                        {editing == 0 ? <IconPencil></IconPencil> : <IconSave></IconSave>}
                    </Button>{' '}
                </Col>
                <Col md={1} sm={1} className="d-flex align-items-center justify-content-center">
                    <Button
                    className="d-flex align-items-center justify-content-center" 
                    onClick={() => moviesStore.removeItem(id)}
                    data-testid = "delete"
                    >
                        <IconCross1></IconCross1>
                    </Button>{' '}
                </Col>
            </Row>
        </Container>
  );
});

export default Card;