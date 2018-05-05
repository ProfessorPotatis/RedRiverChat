import {AzureServerUrl, LocalServerUrl} from './Config'
import { HubConnection } from '@aspnet/signalr'

const chatServerUrl = AzureServerUrl + '/chat'

export const createSignalR = (token) => {
  console.log('Connect to signalr')
  let tokenUrl = (chatServerUrl + '?token=' + token)
  let connection = new HubConnection(tokenUrl)
  return connection
}

export const initChat = (token) => {

  let tokenUrl = (chatServerUrl + '?token=' + token)
  let connection = new HubConnection(tokenUrl)

  let messages = [];
  let key = 123;

  connection.on('send', data => {
    console.log(data);
    messages.push(data);
    key = Math.random();
  });

  connection.on('messageSentToGroup', (group,senderName,message) => {
    messages.push("Group "+group+": "+"Sender: "+senderName+" Message: "+message);
    console.log(message)
  });

  connection.on('addInfoMessageFromGroup', (group, message) => {
    messages.push("Group "+group+": "+"Message: "+message);
    console.log(message)
  });

  connection.on('alterFriendStatus', (name, group, status) => {
    messages.push(name + " in group:"+group+": "+"is now "+status);
    console.log(name)
  });

  connection.on('messageSentToSpecificUser', (name, message) => {
    messages.push(name + ":"+ message);
    console.log(message)
  });

  connection.on('messageSentToAllConnectedUsers', (name, message) => {
    messages.push(name + ":"+ message);
    console.log(message)
  });


  connection.on('userAddedToGroup', (name, group) => {
    messages.push(name + "added to:"+ group);
    console.log(name)
  });

  connection.on('userLeftGroup', (name, group) => {
    messages.push(name + "left:"+ group);
    console.log(name)
  });



  connection.start()
    .catch((err) => {
      console.log(err)
    });

  return connection
}

export const createChatGroup = (groupName, connection) => {
  console.log(connection)
  connection.invoke("sendMessageToAllConnectedUsers", 'test');
  return connection.invoke('joinGroup', groupName)
}

export const addUserToChat = (connection, name, group) => {
  return connection.on('userAddedToGroup', (name, group) => {
    // Code here
  })
}
