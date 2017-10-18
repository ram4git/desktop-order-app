import { ref, authRef } from '../config/constants'

export function auth (email, pw) {
  return authRef().createUserWithEmailAndPassword(email, pw)
    .then(saveUser)
}

export function logout () {
  return authRef().signOut()
}

export function login (email, pw) {
  return authRef().signInWithEmailAndPassword(email, pw)
}

export function resetPassword (email) {
  return authRef().sendPasswordResetEmail(email)
}

export function saveUser (user) {
  return ref.child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user)
}
