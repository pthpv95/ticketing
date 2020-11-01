import { useEffect, useState } from "react"
import { useRequest } from "../hooks/useRequest"
import buildClient from "../api/build-client"

const LandingPage = ({ currentUser }) => {
  // const [user, setUser] = useState(props.currentUser)

  // const { errors, doRequest } = useRequest({
  //   url: "api/users/currentuser",
  //   method: "get",
  // })

  // useEffect(() => {
  //   console.log(props);
  //   setUser(props.currentUser)
  // }, [])
  return (
    <div>
      {currentUser ? <h1>You're signed it</h1> : <h1>You're not signed it</h1>}
    </div>
  )
}

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get("/api/users/currentuser")
  return data
}

export default LandingPage
