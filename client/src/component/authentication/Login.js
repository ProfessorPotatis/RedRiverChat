import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

// Import NPM-modules
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import { CircularProgress } from 'material-ui/Progress'

// Import styles. loginStyles for all imported components with a style attribute and CSS-file for classNames and id.
import {loginStyles} from '../../styles/AuthStyles'
import '../../styles/Styles.css'

// Import components & utils
import {validateLogin} from '../../utils/FormValidation'
import {userLogin} from '../../utils/ApiRequests'
import AppStyles from '../../styles/AppStyles'

/**
 *  Login-component.
 *
 *  @author Jimmy
 */

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userName: '',
      password: '',
      navigate: false,
      loading: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

    /**
     *  Handle form-input. Input are added to this.state.
     *
     *  @author Jimmy
     */

    handleChange = name => event => {
      this.setState({
        [name]: event.target.value
      })
    };

    /**
     *  Handle submit-button. A login-request is sent to server with form-input included.
     *
     *  @author Jimmy
     */

    handleSubmit () {
      this.setState({loading: true})
      let validation = validateLogin(this.state)
      if (validation !== false) {
        return this.props.openSnackBar(validation)
      } else {
        userLogin(this.state)
          .then((response) => {
            localStorage.setItem('token', JSON.stringify(response.data.token))
            this.props.userLogin(response.data.token)
            this.setState({navigate: true})
            return this.props.openSnackBar('Välkommen ' + this.state.userName + '!')
          }).catch((err) => {
            if (err.response.status === 400) {
              return this.props.openSnackBar('För att logga in måste du först verifiera din mailadress.')
            }
            if (err.response.status === 401) {
              return this.props.openSnackBar('Fel användarnamn eller lösenord!')
            }
            return this.props.openSnackBar('Något gick fel. Försök igen!')
          })
      }
    }

    render () {
      const { navigate } = this.state

      if (navigate) {
        return <Redirect to='/' push />
      }

      if (this.props.state.isSignedIn === true) {
        return <Redirect to='/' />
      }

      return (
        <div>
          {this.state.loading ? (
            <div className='AppLoadingDiv'>
              <CircularProgress style={AppStyles.loading} />
            </div>
          ) : (
            <div className='Login'>
              <Typography
                variant='headline'
                color='primary'
                align='left'
                style={loginStyles.title}
              >
                Logga in
              </Typography>
              <form style={loginStyles.container} noValidate autoComplete='off'>
                <TextField
                  id='userName'
                  label='Användarnamn'
                  required
                  style={loginStyles.textField}
                  value={this.state.userName}
                  onChange={this.handleChange('userName')}
                  margin='normal'
                />
                <TextField
                  id='password'
                  label='Lösenord'
                  required
                  style={loginStyles.textField}
                  type='password'
                  autoComplete='current-password'
                  onChange={this.handleChange('password')}
                  margin='normal'
                />
                <div className='LoginButton'>
                  <Button variant='raised' style={loginStyles.button} color='primary' onClick={this.handleSubmit}>
                    Logga in
                  </Button>
                  <div style={loginStyles.loginLinkContainer}>
                    <div style={loginStyles.loginLinkDivLeft}>
                      <Link style={loginStyles.loginLink} to='/register'>Registrera ny användare</Link>
                    </div>
                    <div style={loginStyles.loginLinkDivRight}>
                      <Link style={loginStyles.loginLink} to='/password'>Glömt lösenord?</Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

      )
    }
}

export default Login
