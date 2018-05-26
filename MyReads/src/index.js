import React from "react";
import ReactDOM from "react-dom";
//import App from "./App";
import MyReadsApp from "./components/MyReadsApp";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.render(
  <BrowserRouter>
    <MyReadsApp />
  </BrowserRouter>,
  document.getElementById("root")
);
