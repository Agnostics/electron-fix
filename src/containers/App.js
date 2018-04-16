import React, { Component } from "react";
import "./global.scss";

import Titlebar from "../components/Titlebar";
import Selectfile from "./Selectfile";
import Parsefile from "./Parsefile";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { filepath: "" };
		this.updateFilepath = this.updateFilepath.bind(this);
		this.goBackButton = this.goBackButton.bind(this);
	}

	updateFilepath(path) {
		this.setState({ filepath: path });
	}

	goBackButton() {
		this.setState({ filepath: "" });
	}

	render() {
		const isSelected =
			this.state.filepath === "" ? (
				<Selectfile updatePath={this.updateFilepath} />
			) : (
				<Parsefile backBTN={this.goBackButton} currentPath={this.state.filepath} />
			);

		return (
			<div>
				<Titlebar />
				{isSelected}
				{this.props.author}
			</div>
		);
	}
}

export default App;
