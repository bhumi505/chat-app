import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Chat from "./pages/Chat";

const App = () => {
  return (
    <Router onChange={() => { }}>
      <Route exact path="/" component={Chat} />
    </Router>
  );
};

export default App;
