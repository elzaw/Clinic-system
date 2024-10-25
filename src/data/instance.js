import axios from "axios";

const instance = axios.create({
  baseURL: "https://clinic-system-backend-production.up.railway.app/api",
});

export default instance;
