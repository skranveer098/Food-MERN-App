const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://ranveersinghsingh2644:wYEQMsnck8Szdk6e@cluster0.zs1d1kg.mongodb.net/Food-Delivery-App?retryWrites=true&w=majority';

module.exports = function (callback) {
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, async (err) => {
        if (err) {
            console.log("---" + err);
            callback(err, null, null); // Invoke the callback with the error
        } else {
            console.log("Connected to MongoDB");

            try {
                const db = mongoose.connection.db;

                const foodCollection = await db.collection("food_items");
                const foodData = await foodCollection.find({}).toArray();
                console.log("Fetched foodData:", foodData);

                const categoryCollection = await db.collection("foodCategory");
                const foodCategory = await categoryCollection.find({}).toArray();
                console.log("Fetched foodCategory:", foodCategory);

                // Check if the data is empty
                if (foodData.length === 0) {
                    console.log("Warning: foodData is empty.");
                }
                if (foodCategory.length === 0) {
                    console.log("Warning: foodCategory is empty.");
                }

                // Invoke the callback with the data
                callback(null, foodData, foodCategory);
            } catch (fetchError) {
                console.log("Error while fetching data:", fetchError);
                callback(fetchError, null, null);
            }
        }
    });
};
