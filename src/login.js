import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

// const authUser = (username, password) =>{
//   const dbName = 'mis-' + username;
//   const url = "http://couch.bizzotech.com/mis_workshop_v1/_users/org.couchdb.user:" + username;
//   return fetch(url, {
//     headers: {
//      'Authorization': 'Basic '+btoa(username + ":" + password)
//    }
//  }).then(function(respnonse){
//     if(respnonse.status == 200){
//       localStorage.setItem('loggedIn', 1);
//       localStorage.setItem('username', username);
//       localStorage.setItem('password', password);
//       localStorage.setItem('dbName', dbName);
//
//       location.reload();
//     }
//   });
// }

const authUser = (name, password) =>{
  const dbName = 'mis-' + name;
  const url = "https://couch.bizzotech.com/mis_workshop_v1/_session";
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
        name,
        password
    }),
    headers: {
     'Accept': 'application/json',
     'Content-Type': 'application/json'
   }
 }).then(function(respnonse){
    if(respnonse.status == 200){
      localStorage.setItem('loggedIn', 1);
      localStorage.setItem('username', name);
      localStorage.setItem('password', password);
      localStorage.setItem('dbName', dbName);

      location.reload();
    }
  });
}

const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: '0',
  margin: '0 auto'
}

const Login = React.createClass({
  getInitialState: function() {
    return {
      username : '',
      password : ''
    };
  },
  render : function(){
    return (
      <div style={style}>
        <div>
          <TextField
            floatingLabelText="Username"
            value={this.state.username}
            onChange={(e, username)=>{this.setState({...this.state, username})}}
          />
          <br />
          <TextField
            floatingLabelText="Password"
            type="password"
            value={this.state.password}
            onChange={(e, password)=>{this.setState({...this.state, password})}}
          />
          <br />
          <RaisedButton label="Login" primary={true}
            onClick={()=>{
              authUser(this.state.username, this.state.password)
            }}/>
        </div>
      </div>

    )
  }
})

export default Login;
