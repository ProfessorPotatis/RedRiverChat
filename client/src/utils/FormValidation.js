/**
 *  Validate login-form
 *
 *  @author Jimmy
 */

export const validateLogin = (data) => {
  if (checkIfEmpty(data.userName)) {
    return 'Användarnamnet måste vara ifyllt!'
  }
  if (checkIfEmpty(data.password)) {
    return 'Lösenordet måste vara ifyllt!'
  }

  return false
}

/**
 *  Validate register-form-form
 *
 *  @author Jimmy
 */

export const validateRegister = (data) => {
  if (checkIfEmpty(data.userName)) {
    return 'Användarnamnet måste vara ifyllt!'
  }
  if (checkIfEmpty(data.email)) {
    return 'Mailadressen måste vara ifylld!'
  }
  if (checkIfEmpty(data.password)) {
    return 'Lösenordet måste vara ifyllt!'
  }
  if (checkIfEmpty(data.passwordConfirm)) {
    return 'Lösenordet måste vara ifyllt!'
  }
  if (checkIfEmpty(data.firstName)) {
    return 'Förnamnet måste vara ifyllt!'
  }
  if (checkIfEmpty(data.surname)) {
    return 'Efternamnet måste vara ifyllt!'
  }
  if (data.password !== data.passwordConfirm) {
    return 'Lösenorden är inte lika!'
  }

  return false
}

export const validateChangeDetails = (data) => {
  if (checkIfEmpty(data.email)) {
    return 'Mailadressen måste vara ifylld!'
  }
  if (checkIfEmpty(data.firstName)) {
    return 'Förnamnet måste vara ifyllt!'
  }
  if (checkIfEmpty(data.surname)) {
    return 'Efternamnet måste vara ifyllt!'
  }

  return false
}

export const validateChangePassword = (data) => {
  if (checkIfEmpty(data.password)) {
    return 'Alla fält måste vara ifyllda!'
  }
  if (checkIfEmpty(data.passwordConfirm)) {
    return 'Alla fält måste vara ifyllda!'
  }
  if (checkIfEmpty(data.currentPassword)) {
    return 'Alla fält måste vara ifyllda!'
  }
  if (data.password !== data.passwordConfirm) {
    return 'De nya lösenorden är inte lika!'
  }

  return false
}


const checkIfEmpty = (data) => {
  if (data === '') {
    return true
  }
}
