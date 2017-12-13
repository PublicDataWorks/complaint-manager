import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import StyleGuide from './StyleGuide';


const Home = () => (
    <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h1 className="App-title">Welcome to React V2</h1>
        </header>
        <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload!
        </p>
    </div>
);

const App = () => (
    <Router>
        <div>
            <Route exact path="/" component={Home}/>
            <Route path="/styleguide" component={StyleGuide}/>
        </div>
    </Router>
)
export default App;