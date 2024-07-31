import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './MyOrder.css'; // Ensure you import the CSS file

export default function MyOrder() {
    const [orderData, setorderData] = useState({});

    const fetchMyOrder = async () => {
        console.log(localStorage.getItem('userEmail'));
        await fetch("http://localhost:5000/api/auth/myOrderData", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: localStorage.getItem('userEmail')
            })
        }).then(async (res) => {
            let response = await res.json();
            await setorderData(response);
        });
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    return (
        <div className="my-order-page">
            <Navbar />
            <div className='container'>
                <div className='row'>
                    {orderData !== '' ? Array(orderData).map(data => {
                        return (
                            data.orderData ?
                                data.orderData.order_data.slice(0).reverse().map((item) => {
                                    return (
                                        item.map((arrayData, index) => {
                                            return (
                                                <div key={index} className="order-card-container">
                                                    {arrayData.Order_date ? (
                                                        <div className='order-date'>
                                                            {data = arrayData.Order_date}
                                                            <hr />
                                                        </div>
                                                    ) : (
                                                        <div className='col-12 col-md-6 col-lg-4'>
                                                            <div className="card order-card shadow-lg rounded transition-transform">
                                                                <img src={arrayData.img} className="card-img-top order-card-img" alt={arrayData.name} />
                                                                <div className="card-body order-card-body">
                                                                    <h5 className="card-title order-card-title">{arrayData.name}</h5>
                                                                    <div className='order-card-details'>
                                                                        <span className='badge bg-primary text-white'>{arrayData.qty}</span>
                                                                        <span className='badge bg-secondary text-white'>{arrayData.size}</span>
                                                                        {/* <span className='order-date-text'>{data}</span> */}
                                                                        <div className='price-text'>
                                                                            ₹{arrayData.price}/-
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    );
                                }) : ""
                        );
                    }) : ""}
                </div>
            </div>
            <Footer />
        </div>
    );
}
