import * as React from 'react';

import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import Editor from './components/Editor';
import Footer from './components/Footer';
import Header from './components/Header';
import Landing from './components/Landing';
import NotFound from './components/NotFound';

class App extends React.Component {
	public render() {
		return (
			<div>
				<Router>
					<div>
						<Header />
						<Switch>
							<Route exact={true} path="/" component={Landing} />
							<Route path="/editor" component={Editor} />

							<Route component={NotFound} />
						</Switch>
						<Footer />
					</div>
				</Router>
			</div>
		);
	}
}

export default App;
