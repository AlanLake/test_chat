import React from "react";
import "semantic-ui-css/semantic.min.css";
import './App.css'
import { BrowserRouter as Router, Route } from "react-router-dom";

import Chat from "./components/Chat";
import Join from "./components/Join";

export default function App() {
  return (
    <Router>
      <Route exact path="/" component={Join} />
      <Route exact path="/chat" component={Chat} />
    </Router>
  );
}
