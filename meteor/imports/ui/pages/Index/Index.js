import React from 'react';
import { Jumbotron, Grid, Row, Col } from 'react-bootstrap';

const Index = () => (
    <div className="index">
        <Row>
            <Col xs={12} sm={12} lg={12} md={12}>
                <Jumbotron className="text-center">
                  <h1>dO2s</h1>
                  <p>Drone Online Opensource Service</p>
                  <p>The only drone tool you'll ever need.</p>
                  <p style={ { fontSize: '16px', color: '#aaa' } }>WIP</p>
                </Jumbotron>
            </Col>
        </Row>
    </div>
);

export default Index;
