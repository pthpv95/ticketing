import axios from "axios"
import { useState } from "react"

export const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios[method](url, body)
      onSuccess && onSuccess(response.data)
      return response.data
    } catch (err) {
      setErrors(
        <div className='alert alert-danger'>
          <ul className='my-0'>
            {err.response.data.errors.map((error) => {
              return <li key={error.field}>{error.message}</li>
            })}
          </ul>
        </div>
      )
    }
  }
  return { doRequest, errors }
}
