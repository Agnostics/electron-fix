import React, { Component } from "react";
import "./parsefile.scss";
import ItemContainer from "../../components/ItemContainer";

const fs = require("fs");

class Parsefile extends Component {
	constructor(props) {
		super(props);
		this.state = { rawData: "", author: "", fixes: [], totalFixes: "" };
	}

	componentDidMount() {
		this.parseData();
	}

	parseData() {
		let rawData = fs.readFileSync(this.props.currentPath, "utf8", function read(err, data) {
			return data;
		});

		const author = this.getAuthor(rawData);
		const data = this.cleanUp(rawData);
		let fixes = this.getFixes(data);

		this.setState({ data, author, fixes, totalFixes: fixes.length });
	}

	getAuthor(rawData) {
		const regexp = /(?:Create|Created)[\s]by:[\s](.*)/i;
		regexp.exec(rawData);

		return RegExp.$1;
	}

	cleanUp(rawData) {
		const regexp = /INVAILD SEC CODING ([\s\S]*?)(?:--+)/g;
		const data = rawData.replace(regexp, "");

		return data;
	}

	getFixes(data) {
		const regexp = /(?:--+|)([\s\S]*?)Search.*([\s\S]*?)Replace.*([\s\S]*?)Occurrences:(.?[0-9]?[0-9]?[0-9])/g;

		let searchResults = [];
		var result;
		let infoRaw;

		while ((result = regexp.exec(data)) !== null) {
			var newObj = {
				info: RegExp.$1.trim(),
				search: RegExp.$2.trim(),
				replace: RegExp.$3.trim(),
				occurrences: RegExp.$4.trim()
			};

			infoRaw = RegExp.$1;
			infoRaw = infoRaw.replace(/[\s\S](?:--+)/, "");

			const isHeader = /Export version:/i.test(infoRaw);

			if (isHeader || "") {
				infoRaw = "Description not avaliable";
			}
			newObj.info = infoRaw.trim();
			searchResults.push(newObj);
		}

		return searchResults;
	}

	render() {
		return (
			<div id="parsefile">
				<ItemContainer allFixes={this.state.fixes} />
				{/* {console.log(this.state.fixes)} */}
				<div className="bottom-bar">
					<div className="menu go-back" onClick={this.props.backBTN}>
						GO BACK
					</div>
					<div className="menu small total-fixes">
						<span>{this.state.totalFixes}</span>
						<br />
						total fixes
					</div>

					<div className="menu run-fixes">RUN FIXES</div>
				</div>
			</div>
		);
	}
}
export default Parsefile;
