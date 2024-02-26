import React, { useState, useEffect, useRef} from 'react'
import {Table, Form, Button, Row, Col, InputGroup, Alert} from "react-bootstrap"
import { useAuth } from "./AuthContext";
import {refreshStockNews} from "../Adapters/StockData";

export default function NewStories() {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [newsData, setNewsData] = useState([])
    const [newsType, setNewsType] = useState("market")
    const [newsParameter, setNewsParameter] = useState("market")
    const [newsHeader, setNewsHeader] = useState("Market")
    const tickerSearch = useRef("")
    const topicSearch = useRef("")

    useEffect (() => {
        const getNewsData = async() => {
            setError("")
            setLoading(true)
            try {
                const updatedNewsData = await refreshStockNews(currentUser, newsType, newsParameter)
                setNewsData(updatedNewsData)
            } catch (err) {
                console.error(err)
                setError("Unable to load news data. Try again later")
            } finally {
                setLoading(false)
            }
        }
        getNewsData();
    },[currentUser, newsParameter])

    function handleTickerSearch(e) {
        e.preventDefault()
        if (tickerSearch.current) {
            setNewsType("ticker")
            setNewsParameter(tickerSearch.current.value)
            setNewsHeader(tickerSearch.current.value)
        }
    }

    function handleTopicSearch(e) {
        if (topicSearch.current) {
            setNewsType("topic")
            setNewsParameter(topicSearch.current.value)
            setNewsHeader(e.target.options[e.target.options.selectedIndex].text)
        }
    }

    if (loading) return <Alert className="text-center" variant="primary">Getting market news...</Alert>;
    if (error) return <Alert className="text-center" variant="danger">There was a problem getting market news...</Alert>;

    return (
        <>
        <div>
            <Form className="m-3" onSubmit={handleTickerSearch}>
                <Row className="mb-2">
                    <Col>
                    <InputGroup>
                        <Button onClick={handleTickerSearch}>Search</Button>
                        <Form.Control ref={tickerSearch} type="text" placeholder="News by ticker"></Form.Control>
                    </InputGroup>
                    </Col>
                    <Col>
                    <Form.Group>
                        <Form.Select ref={topicSearch} onChange={handleTopicSearch}>
                            <option>News by topic</option>
                            <option value="blockchain">Blockchain</option>
                            <option value="earnings">Earnings</option>
                            <option value="ipo">IPO</option>
                            <option value="mergers_and_acquisitions">Mergers & Acquisitions</option>
                            <option value="financial_markets">Financial Markets</option>
                            <option value="economy_fiscal">Economy - Fiscal Policy</option>
                            <option value="economy_monetary">Economy - Monetary Policy</option>
                            <option value="economy_macro">Economy - Macro/Overall</option>
                            <option value="energy_transportation">Energy & Transportation</option>
                            <option value="finance">Finance</option>
                            <option value="life_sciences">Life Sciences</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="real_estate">Real Estate & Construction</option>
                            <option value="retail_wholesale">Retail & Wholesale</option>
                            <option value="technology">Technology</option>
                        </Form.Select>
                    </Form.Group>
                    </Col>
                </Row>
            </Form>
        </div>
            <div>
                <br></br>
                <h3>{newsHeader} News</h3>
                <br></br>
                <Table size="sm">
                    <tbody>
                    {!newsData.length && <tr>
                        <td className="text-center">No results for {newsParameter}</td>
                    </tr>}
                    {newsData.map((i) => (
                        <>
                            <tr key={i.url}>
                                <td>{i.source}</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><a href={i.url} target="_blank" rel="noopener noreferrer">{i.summary}</a></td>
                            </tr>
                        </>
                    ))}
                    </tbody>
                </Table>
            </div>
        </>
    )
}