import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatchCart, useCart } from './ContextReducer';
import './Card.css'; // Import the updated CSS file

export default function Card(props) {
  const data = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('');
  const priceRef = useRef();

  const options = props.options;
  const priceOptions = Object.keys(options);
  const foodItem = props.item;
  const dispatch = useDispatchCart();

  const handleClick = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  };

  const handleQty = (e) => {
    setQty(e.target.value);
  };

  const handleOptions = (e) => {
    setSize(e.target.value);
  };

  const handleAddToCart = async () => {
    let food = data.find(item => item.id === foodItem._id);

    if (food) {
      if (food.size === size) {
        await dispatch({ type: "UPDATE", id: foodItem._id, price: finalPrice, qty: qty });
      } else {
        await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty: qty, size: size, img: props.ImgSrc });
        console.log("Size different so simply ADD one more to the list");
      }
    } else {
      await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty: qty, size: size, img: props.ImgSrc });
    }
  };

  useEffect(() => {
    setSize(priceRef.current.value);
  }, []);

  let finalPrice = qty * parseInt(options[size]);

  return (
    <div className="card mt-3 custom-card">
      <img src={props.ImgSrc} className="card-img-top custom-card-img" alt={props.foodName} />
      <div className="card-body">
        <h5 className="card-title">{props.foodName}</h5>
        <div className="container w-100 p-0 options-container">
          <select className="m-2 custom-select" onClick={handleClick} onChange={handleQty}>
            {Array.from(Array(6), (e, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <select className="m-2 custom-select" ref={priceRef} onClick={handleClick} onChange={handleOptions}>
            {priceOptions.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <div className="d-inline ms-2 price-tag">
            ₹{finalPrice}/-
          </div>
        </div>
        <hr />
        <button className="btn add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
