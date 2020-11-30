import axios from "axios"

// command to get service in ingress-nginx namespace
// "k get services -n ingress-nginx"

const apiClient = ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL:
        "http://hienpham.fun",
      headers: req.headers,
    })
  } else {
    return axios.create({
      baseURL: "/",
    })
  }
}

export default apiClient