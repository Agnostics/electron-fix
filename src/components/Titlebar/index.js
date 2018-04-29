import React from "react";
import { remote } from "electron";
import "./titlebar.scss";

const closeWindow = () => {
	remote.BrowserWindow.getFocusedWindow().close();
};

const minWindow = () => {
	remote.BrowserWindow.getFocusedWindow().minimize();
};

const Titlebar = props => (
	<div id="titlebar">
		{props.currentPath != "" ? (
			<div className="go-back" onClick={props.backBTN}>
				<i className="fas fa-angle-left" />
				<span>back</span>
			</div>
		) : (
			<div>null</div>
		)}

		<div className="min" onClick={minWindow}>
			_
		</div>
		<div className="close" onClick={closeWindow}>
			X
		</div>
		<div className="bar" />
	</div>
);

export default Titlebar;
