import React from 'react'
import './Meteo.css'
import { useSelector } from 'react-redux';
import { Card, Col } from 'react-bootstrap';

export default function Meteo({ name, date, temp, min, max, img }) {


    return (
        <Col>

            <Card className=" p-1 text-center text-white meteocard">
                <p className="city">{name ? name : "Nessuna città impostata"}</p>
                <p className="date mb-0">{date ? date : "Nessuna data impostata"}&#8451;</p>
                <div className="d-flex justify-content-center">
                    <Card.Img
                        variant="top"
                        src={`http://openweathermap.org/img/wn/${img}.png`}
                        style={{ width: "3rem" }}
                    />
                </div>

                <Card.Text className="temp">
                    {name?temp:'?'}°
                </Card.Text>

                <div className="minmaxContainer">
                    <div>
                        <p className='mb-0'>Min</p>
                        <Card.Text className="min">
                            {name?min:'?'}°
                        </Card.Text>

                    </div>
                    <div>
                        <p className='mb-0'>Max</p>
                        <Card.Text className="max">
                            {name?max:'?'}°
                        </Card.Text>

                    </div>
                </div>



            </Card>
        </Col>
    )
}
