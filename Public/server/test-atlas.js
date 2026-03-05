const mongoose = require('mongoose');
const uri = "mongodb+srv://Arup:Arup%409775630@cluster0.jvlms7h.mongodb.net/tamluk_telecom?retryWrites=true&w=majority";

console.log("Testing connection...");

mongoose.connect(uri)
    .then(() => {
        console.log("SUCCESS: Connected to MongoDB Atlas!");
        process.exit(0);
    })
    .catch(err => {
        console.error("FAILURE:", err.message);
        process.exit(1);
    });
