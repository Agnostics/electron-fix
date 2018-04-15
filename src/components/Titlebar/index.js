import React from "react";
import { remote } from "electron";
import "./titlebar.scss";

const closeWindow = () => {
	remote.BrowserWindow.getFocusedWindow().close();
};

const minWindow = () => {
	remote.BrowserWindow.getFocusedWindow().minimize();
};

const Titlebar = () => (
	<div id="titlebar">
		<div className="bar" />
		<div className="min" onClick={minWindow}>
			_
		</div>
		<div className="close" onClick={closeWindow}>
			X
		</div>
	</div>
);

export default Titlebar;
