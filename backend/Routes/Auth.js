const express = require('express');
const User = require('../models/User');
const Order = require('../models/Orders');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fetch = require('../middleware/fetchdetails');
const jwtSecret = "HaHa";

router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
        const user = await User.create({
            name: req.body.name,
            password: securePass,
            email: req.body.email,
            location: req.body.location
        });

        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, jwtSecret);
        success = true;
        res.json({ success, authToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Please enter a unique value." });
    }
});

router.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        };
        success = true;
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.post('/getuser', fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.post('/getlocation', async (req, res) => {
    try {
        const { lat, long } = req.body.latlong;
        const location = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=74c89b3be64946ac96d777d08b878d43`)
            .then(response => {
                const result = response.data.results[0].components;
                const { village, county, state_district, state, postcode } = result;
                return `${village}, ${county}, ${state_district}, ${state}\n${postcode}`;
            })
            .catch(error => {
                console.error(error);
                throw new Error("Failed to fetch location");
            });
        res.send({ location });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.post('/foodData', async (req, res) => {
    try {
        if (!global.foodData || !global.foodCategory) {
            return res.status(500).send("Food data or categories not available");
        }
        res.send([global.foodData, global.foodCategory]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});


router.post('/orderData', async (req, res) => {
    let data = req.body.order_data;
    data.splice(0, 0, { Order_date: req.body.order_date });

    try {
        let order = await Order.findOne({ email: req.body.email });
        if (!order) {
            await Order.create({
                email: req.body.email,
                order_data: [data]
            });
            res.json({ success: true });
        } else {
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            );
            res.json({ success: true });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.post('/myOrderData', async (req, res) => {
    try {
        let order = await Order.findOne({ email: req.body.email });
        res.json({ orderData: order });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
