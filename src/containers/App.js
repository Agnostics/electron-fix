import React, { Component } from "react";
import { ipcRenderer as ipc, dialog } from "electron";
import "./global.scss";

import fontawesome from "@fortawesome/fontawesome";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import Titlebar from "../components/Titlebar";
import Selectfile from "./Selectfile";
import Parsefile from "./Parsefile";
import Outputfile from "./Outputfile";

const fs = require("fs");

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { filepath: "", htmlpath: "", jobNumber: "", showOutput: false, fixes: "" };
		this.updateFilepath = this.updateFilepath.bind(this);
		this.goBackButton = this.goBackButton.bind(this);
		this.showOutput = this.showOutput.bind(this);
	}

	componentDidMount() {
		ipc.on("html-file", (event, path) => {
			this.findHTML(path[0]);
		});

		ipc.on("go-back", (event, path) => {
			this.goBackButton();
		});
	}

	updateFilepath(path) {
		this.setState({ filepath: path });
		this.findHTML(path);
	}

	showOutput(fixes) {
		this.setState({ showOutput: true, fixes });
	}

	goBackButton() {
		this.setState({ filepath: "", htmlpath: "", jobNumber: "", showOutput: false, fixes: "" });
	}

	findHTML(path) {
		let directory = path.split("\\");
		directory.pop();
		directory = directory.join("\\");

		let htmlFile;

		const regexp = /_ex[0-9]/i;

		fs.readdirSync(directory).forEach(file => {
			let ext = file.split(".");
			let jobNumber = ext[0].split("_")[0];

			if (ext[1] == "htm") {
				if (!regexp.test(file)) {
					htmlFile = directory + "\\" + file;
					this.setState({ htmlpath: directory + "\\" + file, jobNumber });
				}
			}
		});

		if (htmlFile == undefined) {
			ipc.send("open-html-dialog");
		}
	}

	render() {
		const isSelected =
			this.state.filepath === "" ? (
				<Selectfile updatePath={this.updateFilepath} currentPath={this.state.filepath} />
			) : (
				<Parsefile currentPath={this.state.filepath} showOutput={this.showOutput} />
			);

		return (
			<div>
				<Titlebar currentPath={this.state.filepath} backBTN={this.goBackButton} jobNumber={this.state.jobNumber} />
				{this.state.showOutput ? <Outputfile fixes={this.state.fixes} /> : isSelected}
			</div>
		);
	}
}

export default App;
