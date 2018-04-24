import React, { Component } from "react";
import "./selectfile.scss";
import { ipcRenderer as ipc, dialog } from "electron";

const outputTest = () => {
	ipc.send("open-file-dialog");
};

class Selectfile extends Component {
	constructor(props) {
		super(props);
		this.preventDefault = this.preventDefault.bind(this);
		this.drop = this.drop.bind(this);
	}

	componentDidMount() {
		ipc.on("selected-file", (event, path) => {
			this.props.updatePath(path[0]);
		});
	}

	preventDefault(e) {
		e.preventDefault();
	}

	drop(e) {
		this.props.updatePath(e.dataTransfer.files[0].path);
		e.preventDefault();
	}

	render() {
		return (
			<div id="dragarea" onDragOver={this.preventDefault} onDrop={this.drop}>
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
