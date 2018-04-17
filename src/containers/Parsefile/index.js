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
		console.log(data);
		let fixes = this.getFixes(data);
		console.log(fixes);

		this.setState({ data, author, fixes, totalFixes: fixes.length });
	}

	getAuthor(rawData) {
		const regexp = /(?:Create|Created)[\s]by:[\s](.*)/i;
		regexp.exec(rawData);

		return RegExp.$1;
	}

	cleanUp(rawData) {
		const removeSEC = /INVAILD SEC CODING ([\s\S]*?)(?:--+)/g;
		let data = rawData.replace(removeSEC, "");

		const removeHeader = /Exp([\s\S]*?)Creat.*/i;
		data = data.replace(removeHeader, "");

		return data;
	}

	getFixes(data) {
		const regexp = /(?:--+|)([\s\S]*?)Search.*([\s\S]*?)Replace.*([\s\S]*?)Occurrence.*?\s+(.?[0-9]+|)/gi;

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

				<div className="bottom-bar">
					<div className="menu go-back" onClick={this.props.backBTN}>
						GO BACK
					</div>
					<div className="menu small total-fixes">
						Created by: {this.state.author}
						<br />
						<span>Fixes: {this.state.totalFixes}</span>
					</div>

					<div className="menu run-fixes">RUN FIXES</div>
				</div>
			</div>
		);
	}
}
export default Parsefile;
