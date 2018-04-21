import React, { Component } from "react";
import "./global.scss";

import fontawesome from "@fortawesome/fontawesome";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import Titlebar from "../components/Titlebar";
import Selectfile from "./Selectfile";
import Parsefile from "./Parsefile";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { filepath: "", fixorexp: "fix" };
		this.updateFilepath = this.updateFilepath.bind(this);
		this.goBackButton = this.goBackButton.bind(this);
	}

	updateFilepath(path) {
		this.setState({ filepath: path });
	}

	goBackButton() {
		this.setState({ filepath: "" });
	}

	goBackButton() {
		this.setState({ filepath: "" });
	}

	render() {
		const isSelected =
			this.state.filepath === "" ? (
				<Selectfile updatePath={this.updateFilepath} />
			) : (
				<Parsefile currentPath={this.state.filepath} />
			);

		return (
			<div>
				<Titlebar currentPath={this.state.filepath} backBTN={this.goBackButton} />
				{isSelected}
				{this.props.author}
			</div>
		);
	}
}

export default App;
