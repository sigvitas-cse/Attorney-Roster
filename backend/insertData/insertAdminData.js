const mongoose = require("mongoose");
const AdminsLogin = require("../models/Login"); 
require('dotenv').config();

mongoose.connect( process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});

const admins = [
  { name:'Admin', userId: "newAdmin", password: "Admin@123", userType:'admin', email:'darshan@sigvitas.com' },
  // { name:'Darshan', userId: "Darshanbr66", password: "Darshanbr66@123", userType:'admin' },
  // { name: 'Example', userId: "Example1", password: "Example1@123", userType:'admin' },
];


const saveAdmins = async () => {
  try {
    const result = await AdminsLogin.insertMany(admins);
    console.log("All admins inserted successfully:", result);
  } catch (err) {
    console.error("Error inserting data:", err);
  } finally {
    mongoose.connection.close();
  }
};
saveAdmins();