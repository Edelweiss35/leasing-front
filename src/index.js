import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SignupForm from './Components/SignupForm';
import Main from './Components/Main';
import ReactTable from './Components/React-table';
import SecondForm from './Components/SecondForm';
import ForgotLoginForm from './Components/ForgotLoginForm';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';  
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

const createStoreWithMiddleware = applyMiddleware()(createStore);

const Root = () =>
<Router>
      <div id="app">
      
    <Route exact path="/" component={App} />
    <Route exact path="/frontend/signup" component={ SignupForm } />
    <Route exact path="/frontend/main" component= { Main } />
    <Route exact path="/frontend/React-table" component= { ReactTable } />
      <Route exact path="/frontend/SecondForm" component= { SecondForm } />
      <Route exact path="/frontend/ForgotLoginDetails" component= { ForgotLoginForm } />
  </div>
</Router>

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
