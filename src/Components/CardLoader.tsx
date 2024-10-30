import './styles.css';
import { Container } from 'react-bootstrap';

const CardLoader: React.FC = () => {
    return (
        <Container className = "d-flex flex-row align-items-center justify-content-center otstup2">
            <p>Loading...</p>
            <div className="spinner" data-testid = "spinner"></div>
        </Container>
    );
};

export default CardLoader;