import React from "react";
import { remote } from "electron";
import "./item.scss";

import Highlight from "react-highlight.js";

const checkClick = e => {
	let target = e.currentTarget.style.maxHeight;

	if (target == "40px") {
		e.currentTarget.style.maxHeight = "600px";
	} else {
		e.currentTarget.style.maxHeight = "40px";
	}
};

const handleChild = e => {
	e.stopPropagation();
};

const Item = props => (
	<div id="fix" onClick={checkClick} style={{ maxHeight: "40px" }}>
		<div className="info">{props.info}</div>
		<div className="fix-count">{props.occurrences}</div>
		<div className="show-fix-contain" onClick={handleChild}>
			<div>
				<b>Search:</b>
				<Highlight language="html" style={{ whiteSpace: "normal", marginTop: "-5px" }}>
					{props.search}
				</Highlight>
			</div>

			<div>
				<b>Replace:</b>
				<Highlight language="html" style={{ whiteSpace: "normal", marginTop: "-5px" }}>
					{props.search}
				</Highlight>
			</div>
		</div>
	</div>
);

export default Item;
