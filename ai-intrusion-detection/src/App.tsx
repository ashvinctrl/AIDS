import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-6 space-y-6">
          <Switch>
            <Route path="/" component={Dashboard} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;