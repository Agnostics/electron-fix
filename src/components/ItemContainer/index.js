import React from "react";
import "./itemcontainer.scss";

import Item from "../Item";

const ItemContainer = props => (
	<div id="item">
		{props.allFixes.map((item, index) => {
			return <Item key={index} {...item} />;
		})}
	</div>
);

export default ItemContainer;
