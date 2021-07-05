import React, {useState, useEffect} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import Auth from './pages/Auth'
import Content from './pages/Content'
import Passwordreset from './components/forms/passwordreset'
import './App.css';
import Confirmed from "./components/forms/Confirmed";


function App() {

    const isLoggedIn = () => {
        return localStorage.getItem('TOKEN_KEY') != null;
    };

    const SecuredRoute = ({
        component: Component,
        ...rest
    }) => (
        <Route {...rest}
            render={
                props => isLoggedIn() === true ? (
                    <Component {...props}/>
                ) : (
                    <Redirect to="/" />
                )
            }/>
    );
    const LogRoute = ({
        component: Component,
        ...rest
    }) => (
        <Route render={
            props => isLoggedIn() === true ? (
                <Redirect to="/App/Feed" {...props}/>
            ) : (
                <Component/>)
        }/>
    );

    return (
        <div className="App">
            <Switch >
                <LogRoute path='/' exact
                    component={Auth}/>
                <Route path='/activation/:notify' exact component={Confirmed}/>
                <Route path='/password/reset/:token' exact component={Passwordreset}/>
                <SecuredRoute path='/App/*' exact component={Content} />        
                <LogRoute path='*' exact component={Auth}/>
            </Switch>
        </div>
    );
}

export default App;
