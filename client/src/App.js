import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

// Import NPM-modules
import { MuiThemeProvider } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Drawer from 'material-ui/Drawer'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Snackbar from 'material-ui/Snackbar'
import { CircularProgress } from 'material-ui/Progress'
import HttpsRedirect from 'react-https-redirect'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'

// Import icons for the drawer-menu.
import ChatIcon from '@material-ui/icons/ChatBubble'
import PersonIcon from '@material-ui/icons/People'
import SettingsIcon from '@material-ui/icons/Settings'
import LoginIcon from '@material-ui/icons/Person'
import LogoutIcon from '@material-ui/icons/Cancel'

import CloseIcon from '@material-ui/icons/Close'

// Import styles. appStyles for all imported components with a style attribute and CSS-file for classNames and id.
import './styles/Styles.css'
import {theme} from './styles/Styles'
import AppStyles from './styles/AppStyles'

// Import pages to use with React Router for navigation.
import ChatList from './component/chat/ChatList'
import FriendsList from './component/friends/FriendsList'
import Settings from './component/settings/Settings'
import Login from './component/authentication/Login'
import Register from './component/authentication/Register'
import NewPassword from './component/authentication/NewPassword'
import UserAccount from './component/account/UserAccount'
import FriendRequests from './component/friends/FriendRequests'
import VideoCall from './component/videocall/VideoCall'

import {verifyJWT} from './utils/ApiRequests'
import {initChat} from './utils/SignalR'

/**
 *  Starting point of the application
 *
 *  @author Jimmy
 */

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      menu: false,
      snackBar: false,
      snackBarMessage: '',
      isSignedIn: false,
      userRole: 'User',
      loaded: false,
      signalRConnection: '',
      receiveVideoCall: false,
      videoCall: false,
      callTo: '',
      callFrom: ''
    }
    this.openSnackBar = this.openSnackBar.bind(this)
    this.userLogout = this.userLogout.bind(this)
    this.userLogin = this.userLogin.bind(this)
  }

  /**
     *  Logout. Delete token in local storage and change state.isSignedIn to false.
     *
     *  @author Jimmy
     */

  userLogout () {
    this.setState({
      isSignedIn: false
    })
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  /**
   *  Login. Set state with user details
   *
   *  @author Jimmy
   */

  userLogin (token) {
    sessionStorage.setItem('settingsPanel', JSON.stringify(false))
    this.verifyToken(token)
  }

  /**
   *  Open bottom-bar and display message. Closes after 3 seconds.
   *
   *  @author Jimmy
   */

  openSnackBar = (message) => {
    verifyJWT(this.state.token)
      .then((response) => {
        this.setState({
          snackBar: true,
          snackBarMessage: message,
          userInfo: response.data
        })
      })

    setTimeout(() => {
      this.closeSnackBar()
    }, 3000)
  };

  /**
   *  Close bottom-bar and delete message.
   *
   *  @author Jimmy
   */

  closeSnackBar = () => {
    this.setState({
      snackBar: false,
      snackBarMessage: ''
    })
  };

  /**
   *  Methods for open and close new chat dialog
   *
   *  @author Jimmy
   */

  receiveVideoCallOpen = () => {
    this.setState({ receiveVideoCall: true })
  }

  receiveVideoCallClose = () => {
    this.setState({ receiveVideoCall: false })
  }

  /**
   *  Methods for open and close chat dialog
   *
   *  @author Jimmy
   */

  videoCallOpen = (name) => {
    this.setState({
      videoCall: true,
      callTo: name
    })
  }

  videoCallClose = () => {
    this.setState({
      videoCall: false,
      callTo: ''
    })
  }


  /**
     *  Render all links in drawer-menu.
     *
     *  @author Jimmy
     */

    renderMenu = () => {
      return (
        <div style={AppStyles.menu}>
          <List>
            <ListItem
              button
              component={Link}
              to='/'
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary='Start' />
            </ListItem>
            <ListItem
              button
              component={Link}
              to='/chats'
            >
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary='Chat' />
            </ListItem>
            <ListItem
              button
              component={Link}
              to='/friends'
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary='Vänner' />
            </ListItem>
            <ListItem
              button
              component={Link}
              to='/settings'
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary='Inställningar' />
            </ListItem>
          </List>
          <Divider />
          <ListItem
            button
            component={Link}
            to='/'
            onClick={this.userLogout}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary='Logga ut' />
          </ListItem>
        </div>
      )
    };

    /**
     *  Open drawer-menu.
     *
     *  @author Jimmy
     */

    toggleMenu = (open) => () => {
      sessionStorage.setItem('settingsPanel', JSON.stringify(false))
      this.setState({
        menu: open
      })
    };

  /**
   *  Verify token and set state according to response from server.
   *  If token is valid, a chat-socket is initialized.
   *
   *  @author Jimmy
   */

    verifyToken (token) {
      return verifyJWT(token)
        .then((response) => {
          this.setState({
            token: token,
            isSignedIn: true,
            userInfo: response.data,
            loaded: true,
            signalRConnection: initChat(token)
          }, () => {
            this.handleEvents()
          })
        }).catch(() => {
          this.setState({
            isSignedIn: false,
            loaded: true
          })
        })
    }

  /**
   *  Handle SignalR events
   *
   *  @author Jimmy
   */

  handleEvents = () => {
    this.state.signalRConnection.on('messageSentToGroup', (group, senderName, message) => {
      if (senderName !== this.state.userInfo.username && window.location.pathname !== '/chats') {
        return this.openSnackBar(senderName + ' skickade ett meddelande i gruppen ' + group + ' !')
      }
    })

    this.state.signalRConnection.on('userAddedToGroup', (name, group) => {
      console.log('addedToGroup')
    })
  }
  /**
     *  Check if valid token in local storage before component mounts.
     *
     *  @author Jimmy
     */

  componentWillMount () {
    sessionStorage.setItem('settingsPanel', JSON.stringify(false))
    if (localStorage.getItem('token')) {
      let token = JSON.parse(localStorage.getItem('token'))
      this.verifyToken(token)
    } else {
      this.setState({
        isSignedIn: false,
        loaded: true
      })
    }
  }

  /**
     *  Check if valid token in local storage before component updates.
     *
     *  @author Jimmy
     */

  componentWillUpdate () {
    if (localStorage.getItem('token')) {
      let token = JSON.parse(localStorage.getItem('token'))

      if (this.state.token) {
        if (token !== this.state.token) {
          this.verifyToken(token)
        }
      }
    }
  }

  render () {
    return (
      <HttpsRedirect>
        <Router>
          <MuiThemeProvider theme={theme} >
            {this.state.loaded ? (
              <div className='App'>
                <AppBar
                  position='sticky'
                  style={AppStyles.root}
                >
                  <Toolbar>
                    <Typography
                      variant='title'
                      color='inherit'
                      style={AppStyles.flex}
                    />
                    {this.state.isSignedIn ? (
                      <IconButton color='inherit' aria-label='Menu' style={AppStyles.menuButton} onClick={this.toggleMenu(true)}>
                        <MenuIcon />
                      </IconButton>
                    ) : (
                      <p />
                    )}
                  </Toolbar>
                </AppBar>
                <div className='App-Body'>
                  <Route path='/' exact component={() => <UserAccount state={this.state} />} />
                  <Route path='/chats' component={() => <ChatList state={this.state} />} openSnackBar={this.openSnackBar} />
                  <Route path='/friends' component={() => <FriendsList state={this.state} openSnackBar={this.openSnackBar} startVideoCall={this.videoCallOpen} />} />
                  <Route path='/settings' component={() => <Settings state={this.state} openSnackBar={this.openSnackBar} />} />
                  <Route path='/login' component={() => <Login state={this.state} openSnackBar={this.openSnackBar} userLogin={this.userLogin} />} />
                  <Route path='/register' component={() => <Register state={this.state} openSnackBar={this.openSnackBar} />} />
                  <Route path='/password' component={() => <NewPassword state={this.state} />} />
                  <Route path='/friendrequests' component={() => <FriendRequests state={this.state} openSnackBar={this.openSnackBar} />} />
                </div>
                <Snackbar
                  open={this.state.snackBar}
                  onClose={this.closeSnackBar}
                  SnackbarContentProps={{
                    'aria-describedby': 'message-id'
                  }}
                  message={<span id='message-id'>{this.state.snackBarMessage}</span>}
                />
                <Drawer anchor='right' open={this.state.menu} onClose={this.toggleMenu(false)}>
                  <div
                    tabIndex={0}
                    role='button'
                    onClick={this.toggleMenu(false)}
                    onKeyDown={this.toggleMenu(false)}
                  >
                    {this.renderMenu()}
                  </div>
                </Drawer>
                <Dialog
                  fullScreen
                  open={this.state.videoCall}
                  onClose={this.videoCallOpen}
                  aria-labelledby='responsive-dialog-title'
                >

                  <IconButton color='inherit' onClick={this.videoCallClose} aria-label='Close'>
                    <CloseIcon />
                  </IconButton>
                  <VideoCall callTo={this.state.callTo} callFrom={this.state.callFrom} closeDialog={this.videoCallClose} state={this.state} openSnackBar={this.openSnackBar}/>
                </Dialog>
              </div>
            ) : (
              <div className='AppLoadingDiv'>
                <CircularProgress style={AppStyles.loading} />
              </div>
            )}
          </MuiThemeProvider>
        </Router>
      </HttpsRedirect>
    )
  }
}

export default App
