import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import NewsManager from './pages/admin/NewsManager'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/admin/news" component={NewsManager} />
          {/* Add more routes here as needed */}
        </Switch>
      </div>
    </Router>
  )
}

export default App