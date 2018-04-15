import React, { Component } from "react";

import Titlebar from "./components/Titlebar";
import Selectfile from "./components/Selectfile";
import "./global.scss";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { filepath: "" };
		this.updateFilepath = this.updateFilepath.bind(this);
	}

	updateFilepath(path) {
		this.setState({ filepath: path });
	}

	render() {
		return (
			<div>
				<Titlebar />
				<Selectfile updatePath={this.updateFilepath} />
			</div>
		);
	}
}

export default App;
