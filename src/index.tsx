import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Theme from './components/Theme/Theme';
import CssBaseline from '@material-ui/core/CssBaseline';

ReactDOM.render(
    <MuiThemeProvider theme={Theme}>
        <React.Fragment>
            <CssBaseline />
            <App />
        </React.Fragment>
    </MuiThemeProvider>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
