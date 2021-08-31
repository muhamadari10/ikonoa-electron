import React from 'react'
import { render } from 'react-dom'
import { Application } from 'react-rainbow-components';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { SimpleVerticalNavigation } from './containers/navigation/MainNav'
import { Login } from './containers/login/Login'
import Button from "react-bootstrap/Button";

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

render(
  <Application>
    <Router>
      <Switch>
        <Route path="/home" component={SimpleVerticalNavigation} />
        <Route path="/" component={Login} />
      </Switch>
    </Router>
  </Application>
  , mainElement)
