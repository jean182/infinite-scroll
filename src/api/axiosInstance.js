import axios from "axios";
import humps from "humps";

const axiosInstance = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => humps.camelizeKeys(data),
  ],
  transformRequest: [
    data => humps.decamelizeKeys(data),
    ...axios.defaults.transformRequest,
  ],
});

export default function api(method, url, data = {}, options = {}) {
  const httpMethod = method.toLowerCase();

  const hasData = ["post", "put", "patch"].indexOf(httpMethod) >= 0;
  const settings = hasData ? options : data;

  const request = hasData
    ? axiosInstance[httpMethod](url, data, settings)
    : axiosInstance[httpMethod](url, settings);

  return request;
}
