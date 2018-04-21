import React, { Component } from "react";
import "./selectfile.scss";
import { ipcRenderer as ipc, dialog } from "electron";

const outputTest = () => {
	ipc.send("open-file-dialog");
};

class Selectfile extends Component {
	componentDidMount() {
		ipc.on("selected-file", (event, path) => {
			this.props.updatePath(path[0]);
		});
	}

	render() {
		document.body.ondrop = ev => {
			this.props.updatePath(ev.dataTransfer.files[0].path);
			// ipc.send("open-file-dialog");
			ev.preventDefault();
		};

		document.ondragover = document.ondrop = ev => {
			ev.preventDefault();
		};

		return (
			<div id="dragarea">
				<div className="drag-area">
					<div className="drag-items">
						<i className="fas fa-upload" />
						<div>Drag Important Fixes Here</div>
						<small>- or -</small>
						<button onClick={outputTest}>Browse File</button>
					</div>
				</div>
			</div>
		);
	}
}
export default Selectfile;
