import React, { Component } from "react";
import "./outputfile.scss";
import ItemContainer from "../../components/ItemContainer";

const fs = require("fs");

class Outputfile extends Component {
	constructor(props) {
		super(props);
		this.state = { rawHtml: "" };
	}

	componentDidMount() {
		let raw = this.getHTMLText();

		this.setState({ rawHtml: raw });
	}

	getHTMLText() {
		let rawHTML = fs.readFileSync(this.props.htmlpath, "utf8", function read(err, data) {
			return data;
		});

		this.runFixes(rawHTML);
	}

	runFixes(raw) {
		let regexp;
		let result;
		this.props.fixes.forEach(element => {
			regexp = new RegExp(element.search, "gi");

			while ((result = regexp.exec(raw)) !== null) {
				console.log(element.search);
			}
		});
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
