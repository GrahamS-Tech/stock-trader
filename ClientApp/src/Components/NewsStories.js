import React, {useState} from 'react'
import {Dropdown, Form, Table} from "react-bootstrap";
import {useAuth} from "./AuthContext";

export default function NewStories() {
    const {currentUser} = useAuth();
    const [loading, setLoading] = useState();

    return (
        <div>
            <h3>Market News</h3>
            <Form className="m-3">
                <div className="row">
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>News by ticker</Form.Label>
                            <Form.Control type="text" placeholder="News by ticker..."></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>News by topic</Form.Label>
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary">Select topic</Dropdown.Toggle>
                                <Dropdown.Menu style={{overflowY: "scroll", maxHeight: "400px"}}>
                                    <Dropdown.Item key="blockchain">Blockchain</Dropdown.Item>
                                    <Dropdown.Item key="earnings">Earnings</Dropdown.Item>
                                    <Dropdown.Item key="ipo">IPO's</Dropdown.Item>
                                    <Dropdown.Item key="mergers_and_acquisitions">Mergers & Acquisitions</Dropdown.Item>
                                    <Dropdown.Item key="financial_markets">Financial Markets</Dropdown.Item>
                                    <Dropdown.Item key="economy_fiscal">Economy - Fiscal Policy</Dropdown.Item>
                                    <Dropdown.Item key="economy_monetary">Economy - Monetary Policy</Dropdown.Item>
                                    <Dropdown.Item key="economy_macro">Economy - Macro/Overall</Dropdown.Item>
                                    <Dropdown.Item key="energy_transportation">Energy & Transportation</Dropdown.Item>
                                    <Dropdown.Item key="finance">Finance</Dropdown.Item>
                                    <Dropdown.Item key="life_sciences">Life & Sciences</Dropdown.Item>
                                    <Dropdown.Item key="manufacturing">Manufacturing</Dropdown.Item>
                                    <Dropdown.Item key="real_estate">Real Estate & Construction</Dropdown.Item>
                                    <Dropdown.Item key="retail_wholesale">Retail & Wholesale</Dropdown.Item>
                                    <Dropdown.Item key="technology">Technology</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <Table>
                        <tbody>

                        </tbody>
                    </Table>
                </div>
            </Form>
        </div>
    )
}