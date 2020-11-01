import { useState } from "react"
import { useRequest } from "../../hooks/useRequest"
import Router from "next/router"

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { doRequest, errors } = useRequest({
    method: "post",
    url: "/api/users/signup",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    doRequest()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className='form-group'>
        <label>Email address</label>
        <input
          className='form-control'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type='email'
        />
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          className='form-control'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </div>
      {errors}
      <button className='btn btn-primary' type='submit'>
        Sign Up
      </button>
    </form>
  )
}

export default SignUp
