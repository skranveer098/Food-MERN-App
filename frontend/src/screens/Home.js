import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './Home.css'; // Import the updated CSS file

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState('');

  const loadFoodItems = async () => {
    try {
      let response = await fetch("http://localhost:5000/api/auth/foodData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      response = await response.json();
      setFoodItems(response[0]);
      setFoodCat(response[1]);
    } catch (error) {
      console.error('Error fetching food data:', error);
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="carousel-container">
        <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-inner" id="carousel">
            <div className="carousel-caption">
              <div className="d-flex justify-content-center align-items-center">
                <input
                  className="form-control me-2 search-input"
                  type="search"
                  placeholder="Search for delicious food..."
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn clear-btn" onClick={() => setSearch('')}>X</button>
              </div>
            </div>
            <div className="carousel-item active">
              <img src="https://media.istockphoto.com/id/1041137232/photo/100-gluten-free-low-carb-hamburger-and-bun.webp?b=1&s=170667a&w=0&k=20&c=NIOrqm16kc6OEQLUC-VHARagz5JkLncQmWuVlUwC5sA=" className="d-block w-100" alt="Burger" />
            </div>
            <div className="carousel-item">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGl6emF8ZW58MHx8MHx8fDA%3D" className="d-block w-100" alt="Pizza" />
            </div>
            <div className="carousel-item">
              <img src="https://images.unsplash.com/photo-1532433517163-b7fec0e9a36f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJhcmJlcXVlfGVufDB8fDB8fHww" className="d-block w-100" alt="Barbecue" />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div className="container">
        {foodCat.length > 0 ? foodCat.map((data) => (
          <div className="row mb-3" key={data.id}>
            <div className="category-title">
              {data.CategoryName}
            </div>
            <hr className="hr-custom" />
            <div className="card-container">
              {foodItems.length > 0 ? foodItems.filter(
                (items) => (items.CategoryName === data.CategoryName) && (items.name.toLowerCase().includes(search.toLowerCase()))
              ).map(filterItems => (
                <div key={filterItems.id} className="card-wrapper">
                  <Card foodName={filterItems.name} item={filterItems} options={filterItems.options[0]} ImgSrc={filterItems.img}></Card>
                </div>
              )) : <div>No Such Data</div>}
            </div>
          </div>
        )) : ""}
      </div>
      <Footer />
    </div>
  );
}
