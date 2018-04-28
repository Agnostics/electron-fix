import React from "react";
import { render } from "react-dom";
import App from "./containers/App";

let root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);

// Now we can render our application into it
render(<App />, document.getElementById("root"));
