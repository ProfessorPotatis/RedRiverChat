import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

// Import NPM-modules
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import Badge from 'material-ui/Badge';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Toolbar from 'material-ui/Toolbar';

// Import styles. ChatListStyles for all imported components with a style attribute and CSS-file for classNames and id.
import {friendsListStyles} from "../../styles/FriendsStyles";
import '../../styles/Styles.css'
import axios from "axios/index";
import {AzureServerUrl} from "../../utils/Config";

// Import icons for the drawer-menu.
import ChatIcon from '@material-ui/icons/ChatBubble';
import VideoIcon from '@material-ui/icons/VoiceChat';
import CloseIcon from '@material-ui/icons/Close';

// Import components
import FriendsView from './FriendsView';

/**
 *  FriendsList-component. Starting page of friends.
 *
 *  @author Jimmy
 */

class FriendsList extends Component {

  constructor(props){
    super(props);

    this.state = {
      friends: [],
      isLoaded: false,
      dialog: false,
    };
  }

  /**
   *  Set friends name to view info.
   *
   *  @author Jimmy
   */

  handleFriendClick(username) {

    console.log(username);
    this.setState({
      friendsUsername: username,
    });
  }

  /**
   *  Methods for open and close modal
   *
   *  @author Jimmy
   */

  handleDialogOpen = () => {
    this.setState({ dialog: true });
  };

  handleDialogClose = () => {
    this.setState({ dialog: false });
  };

  /**
   *  Render list of friends
   *
   *  @author Jimmy
   */

  renderFriendsList() {

    let listArray = [];

    for (let i = 0; i < this.state.friends.length; i++) {

      listArray.push(
        <Paper style={friendsListStyles.paper} elevation={1}>
          <Typography
            style={friendsListStyles.friendsName}
            variant="headline"
            component="h3"
            onClick={(() => {
              this.handleFriendClick(this.state.friends[i]);
              return this.handleDialogOpen();
            })}
          >
            {this.state.friends[i]}
            </Typography>
          <IconButton aria-label="Chat">
            <ChatIcon/>
          </IconButton>
          <IconButton aria-label="Video call">
            <VideoIcon/>
          </IconButton>
        </Paper>
      );
    }

    return listArray;
  }

  /**
   *  Render list of friends. Large version
   *
   *  @author Jimmy
   */

  renderLargeFriendsList() {

    let listArray = [];

    for (let i = 0; i < this.state.friends.length; i++) {

      listArray.push(
        <Paper style={friendsListStyles.paper}
               elevation={1}
        >
          <Typography
            style={friendsListStyles.friendsName}
            variant="headline"
            component="h3"
            onClick={() => this.handleFriendClick(this.state.friends[i])}
          >
            {this.state.friends[i]}
          </Typography>
          <IconButton aria-label="Chat">
            <ChatIcon/>
          </IconButton>
          <IconButton aria-label="Video call">
            <VideoIcon/>
          </IconButton>
        </Paper>
      );
    }

    return listArray;
  }

  /**
   *  Get friends from server.
   *
   *  @author Jimmy
   */

  sendRequest() {

    return axios({
      method: 'get',
      url: AzureServerUrl + '/api/user/getfriends',
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.props.state.token},
    });
  }

  componentDidMount() {

    this.sendRequest()
      .then((response) => {

        response.data.friendList.forEach((i) => {
          this.state.friends.push(i);
          });
        }).then(() => {

          console.log(this.state);
          this.setState({
            isLoaded: true,
          });
        }).catch((error) => {
          //console.log(error)
    });
  }

  render() {

    if (this.props.state.isSignedIn === false) {
      return <Redirect to="/login" />;
    }

    return (
      <div className="FriendsList">
        <div className="FriendsList-Header">
          <Badge badgeContent={2} color="error">
            <Button color="primary" component={Link} to={'/friendrequests'}>
              <Icon >add</Icon>
              Lägg till vän
            </Button>
          </Badge>
        </div>
        <Hidden mdUp>
          <div className="FriendsList-Inner">
            {this.renderFriendsList()}
            </div>
        </Hidden>
        <Hidden smDown>
          <div className="FriendsList-Inner-Large">
            <div className="FriendsList-Inner-Large-Menu">
              {this.renderLargeFriendsList()}
            </div>
            <div className="FriendsList-Inner-Large-Content">
              {this.state.friendsUsername ? (
                <FriendsView state={this.props.state}
                             friendsUsername={this.state.friendsUsername}
                />
              ) : (
                <Typography>
                  Välj en vän för att se info!
                </Typography>
              )}
            </div>
            </div>
        </Hidden>
        <Dialog
          fullScreen={true}
          open={this.state.dialog}
          onClose={this.handleDialogClose}
          aria-labelledby="responsive-dialog-title"
        >
          <Toolbar>
            <IconButton color="inherit" onClick={this.handleDialogClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <FriendsView state={this.props.state}
                       friendsUsername={this.state.friendsUsername}
          />
        </Dialog>
      </div>

    );
  }
}

export default FriendsList;
