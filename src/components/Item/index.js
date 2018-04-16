import React from "react";
import { remote } from "electron";
import "./item.scss";

const Item = props => (
	<div id="fix">
		<div className="info">{props.info}</div>
		<div className="fix-count">{props.occurrences}</div>
	</div>
);

export default Item;
