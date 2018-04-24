import React, { Component } from "react";
import "./outputfile.scss";
import ItemContainer from "../../components/ItemContainer";

class Outputfile extends Component {
	componentDidMount() {
		console.log(this.props.fixes);
	}

	render() {
		return (
			<div id="outputfile">
				<div className="top-bar" />
				<ItemContainer allFixes={this.props.fixes} />
			</div>
		);
	}
}
export default Outputfile;
