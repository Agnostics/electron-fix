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
		return (
			<div id="dragarea">
				<div className="drag-area">
					<div className="drag-items">
						<i className="fa fa-upload" />
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
