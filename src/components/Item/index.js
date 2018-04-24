import React from "react";
import { remote } from "electron";
import "./item.scss";

import Highlight from "react-highlight.js";

const checkClick = e => {
	if (e.currentTarget.style.maxHeight == "40px") {
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
		<div className="info">{props.info || "Description not supplied"}</div>
		<div className="fix-count" title="Total Occurrences">
			{props.occurrences}
		</div>
		<div className="show-fix-contain" onClick={handleChild}>
			<div>
				<b style={{ userSelect: "none" }}>Search:</b>
				<Highlight language="html" style={{ whiteSpace: "normal", marginTop: "-5px" }}>
					{props.search}
				</Highlight>
			</div>

			<div>
				<b style={{ userSelect: "none" }}>Replace:</b>
				<Highlight language="html" style={{ whiteSpace: "normal", marginTop: "-5px" }}>
					{props.replace}
				</Highlight>
			</div>
		</div>
	</div>
);

export default Item;
