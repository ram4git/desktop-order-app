import { ref } from '../config/constants'



export function getOrders (user) {
  return ref.child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user)
}

export function getOrder(orderId) {
  const refPath = `orders/${orderId}`;

}
