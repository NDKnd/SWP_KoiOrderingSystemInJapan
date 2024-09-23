import axios from "axios";
const baseURL = "";

const config = {
    baseURL: baseURL,
};

const api = axios.create(config);

api.defaults.baseURL = baseURL;

const handleBefore = (config) => {

    const token = localStorage.getItem("token")?.replaceAll('"',"");
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
};

api.interceptors.request.use(handleBefore,null);

export default api