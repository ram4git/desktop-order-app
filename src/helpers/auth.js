import { ref, authRef } from '../config/constants'


export function auth (email, pw) {
  return authRef().createUserWithEmailAndPassword(email, pw)
    .then(saveUser)
}

export function logout () {
  return authRef().signOut().then( () => {
    sessionStorage.removeItem('mobile');
  });
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

export function getUserMobileNumber(uid) {
  ref.child(`authMobileMap/${uid}`).once('value', (snap) => {
    const mobile = snap.val();
    console.log('FETCHED MOBILE NUMBER', mobile);
    sessionStorage.setItem('mobile', mobile);
    ref.child(`users/${mobile}/name`).once('value', (name) => {
      sessionStorage.setItem('name', name.val());
    });
  });
}

export function onFetchUserMobileNumber() {
  const uid = authRef().currentUser.uid;
  return ref.child(`authMobileMap/${uid}`).once('value')
}
