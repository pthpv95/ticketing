import Router from "next/router"
import { useEffect, useState } from "react"
import StripeCheckout from "react-stripe-checkout"
import { useRequest } from "../../hooks/useRequest"

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    method: "post",
    url: "/api/payments",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTimeLeft()
    const intervalId = setInterval(() => {
      findTimeLeft()
    }, 1000)

    return () => clearInterval(intervalId)
  }, [order])

  if (timeLeft < 0) {
    return <div>Order expired</div>
  }

  return (
    <div>
      <h1>{order.ticket.title}</h1>
      <h3>{order.ticket.price} $</h3>
      Time left to pay: {timeLeft}
      <StripeCheckout
        amount={order.ticket.price * 100}
        token={({ id }) => {
          doRequest({ token: id })
        }}
        email={currentUser.email}
        stripeKey='pk_test_51HsKgxCvBQyKOtfZmHcfxaxENJaO1CMOtlhb3rclLoKF4ujow2vKjr0duTixw9S7i3Mv79JzQrXWnzE1IehWevvp00MCZhwuF1'
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)
  return { order: data }
}

export default OrderShow
