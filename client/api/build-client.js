import axios from "axios"

// command to get service in ingress-nginx namespace
// "k get services -n ingress-nginx"

const apiClient = ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    })
  } else {
    return axios.create({
      baseURL: "/",
    })
  }
}

export default apiClient