import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import {loginStyles} from "../../styles/AuthStyles";

class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            userName: '',
            password: '',
        };
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        return (
            <div style={loginStyles.login}>
                <Typography
                    variant="headline"
                    color="default"
                    align="left"
                    style={loginStyles.title}
                >
                    Logga in
                </Typography>
                <form style={loginStyles.container} noValidate autoComplete="off">
                    <TextField
                        id="name"
                        label="Användarnamn"
                        style={loginStyles.textField}
                        value={this.state.name}
                        onChange={this.handleChange('name')}
                        margin="normal"
                    />
                    <TextField
                        id="password"
                        label="Lösenord"
                        style={loginStyles.textField}
                        type="password"
                        autoComplete="current-password"
                        onChange={this.handleChange('password')}
                        margin="normal"
                    />
                    <div style={loginStyles.loginButton}>
                        <Button variant="raised" style={loginStyles.button}>
                            Logga in
                        </Button>
                        <div style={loginStyles.loginLinkContainer}>
                            <div style={loginStyles.loginLinkDivLeft}>
                                <Link style={loginStyles.loginLink} to="/register">Registrera ny användare</Link>
                            </div>
                            <div style={loginStyles.loginLinkDivRight}>
                                <Link style={loginStyles.loginLink} to="/password">Glömt lösenord?</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        );
    }
}

export default Login;