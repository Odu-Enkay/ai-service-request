import axios from "axios";

const API = axios.create({
  baseURL:process.env.NODE_ENV === "production"
    ? "https://ai-service-request.onrender.com"
    //: "http://localhost:3000/api",
});

export default API;
