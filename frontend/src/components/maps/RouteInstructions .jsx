import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Badge, ListGroup } from 'react-bootstrap';

const RouteInstructions = () => {
    const map_instructions = useSelector(state => state.infotravels.map_instructions);

    useEffect(() => {
    }, [map_instructions]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className='bg-white rounded p-3 shadow'>
            {map_instructions.instructions ? (
                <React.Fragment>
                    <p className='fw-bold'>Istruzioni</p>
                    <p>Distanza totale: <Badge bg="primary">{(map_instructions.summary.totalDistance / 1000).toFixed(2)} km</Badge></p>
                    <p>Tempo totale: <Badge bg="success">{formatTime(map_instructions.summary.totalTime)}</Badge></p>
                    <hr />
                    <p className='fw-bold'>Autostrade:</p>
                    <p>{map_instructions.name}</p>
                    <hr />
                    <ListGroup style={{ maxHeight: '30rem', overflowY: 'auto' }}>
                        <p className='fw-bold'>Percorso:</p>
                        {map_instructions.instructions.map((instruction, index) => (
                            <ListGroup.Item key={index} style={{backgroundColor:'#EFF3F8'}}>{instruction.text}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </React.Fragment>
            ) : <p>Nessuna istruzione disponibile.</p>}
        </div>
    );
};

export default RouteInstructions;
