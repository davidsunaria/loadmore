import { useState, useEffect } from "react"
import axios from "axios"
import { Card, Spinner } from "react-bootstrap"

function Pagination() {

    const [value, setValue] = useState([])
    const [page, setPage] = useState(28)
    const [nextpage, setNextPage] = useState(null)
    const [isBottom, setBottom] = useState(false)
    const [loadmore, setLoadMore] = useState(false)

    useEffect(() => {
        axios.get(`https://gorest.co.in/public/v1/posts?page=${page}`).then((res) => {
            const { meta, data } = res.data
            const { page } = meta.pagination
            let nextpage = page + 1
            setNextPage(nextpage)
            setValue(data)
        })
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll)
        };
    }, [])


    const onScroll = (e) => {
        console.log("window.innerheight",window.innerHeight)
         console.log(" window.scrollY", window.scrollY)
         console.log(" document.body.offsetHeight", window.scrollY)
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            setBottom(true)
        }
        else {
            setBottom(false)
        }
    };


    useEffect(() => {

        if (isBottom) {
            if (nextpage < 33) {

                axios.get(`https://gorest.co.in/public/v1/posts?page=${nextpage}`).then((res) => {
                    const { meta, data } = res.data
                    const { page } = meta.pagination
                    let nextpage = page + 1
                    setNextPage(nextpage)
                    setValue((value) => ([...value, ...data]))
                    setLoadMore(true)
                })
            }
            else {
                setLoadMore(false)
            }
        }
    }, [isBottom])


    return (
        <>
            <div className="container">
                <div className="row">

                    {
                        value.map((data, index) => {
                            return (
                                <div className="col-md-4" key={index}>
                                    <Card border="primary" style={{ width: '18rem' }}>
                                        <Card.Header>Id: {data.id}</Card.Header>
                                        <Card.Body>
                                            <Card.Title>title: {data.title}</Card.Title>
                                            <Card.Text>
                                                body: {data.body}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card><br /><br />
                                </div>
                            )
                        })}
                </div>
                {
                    loadmore && <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                }

            </div>


        </>
    );
}

export default Pagination;
