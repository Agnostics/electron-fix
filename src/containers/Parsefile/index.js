import React, { Component } from "react";
import "./parsefile.scss";
import ItemContainer from "../../components/ItemContainer";

const fs = require("fs");

class Parsefile extends Component {
	constructor(props) {
		super(props);
		this.state = { rawData: "", author: "", fixes: [], totalFixes: "", exportType: "clean", tocType: "yes" };
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
		const exportType = this.getExport(rawData);
		const tocType = this.getTOC(rawData);

		let fixes = this.getFixes(data);

		this.setState({ data, author, fixes, totalFixes: fixes.length, exportType, tocType });
	}

	getAuthor(rawData) {
		const regexp = /(?:Create|Created)[\s]by:[\s](.*)/i;
		regexp.exec(rawData);

		return RegExp.$1;
	}

	getExport(rawData) {
		const regexp = /(?:Export Trace).?[\s](.*)/i;

		regexp.exec(rawData);

		return RegExp.$1;
	}

	getTOC(rawData) {
		const regexp = /(?:toc header).?[\s](.*)/i;

		regexp.exec(rawData);

		return RegExp.$1;
	}

	cleanUp(rawData) {
		const removeSEC = /INVAILD SEC CODING ([\s\S]*?)(?:--+)/g;
		let data = rawData.replace(removeSEC, "");

		const removeHeader = /Exp([\s\S]*?)Creat.*/i;
		data = data.replace(removeHeader, "");

		const removeXPPGlobals = /[\s\S].*globals in XPP([\s\S]*?)(?:--+)/gi;
		data = data.replace(removeXPPGlobals, "");

		return data;
	}

	getFixes(data) {
		const regexp = /(?:--+|)([\s\S]*?)Search.*([\s\S]*?)Replace.*([\s\S]*?)Occurrence.*?\s+(.?[0-9]+|.*)/gi;

		let searchResults = [];
		var result;
		let infoRaw;
		let occRaw;

		while ((result = regexp.exec(data)) !== null) {
			var newObj = {
				info: RegExp.$1.trim(),
				search: RegExp.$2.trim(),
				replace: RegExp.$3.trim(),
				occurrences: RegExp.$4.trim()
			};

			infoRaw = RegExp.$1;
			occRaw = RegExp.$4;

			infoRaw = infoRaw.replace(/[\s\S](?:--+)/, "");

			if (!/[0-9]/.test(occRaw)) {
				newObj.occurrences = 0;
			}

			newObj.info = infoRaw.trim();
			searchResults.push(newObj);
		}

		return searchResults;
	}

	render() {
		return (
			<div id="parsefile">
				<div className="top-bar">
					<div className="icons">
						<i className="fas fa-recycle" title={this.state.exportType} />
						<i className="fab fa-slack-hash" title={"TOC: " + this.state.tocType} />
					</div>

					<div className="byline">
						created by: <br />
						{this.state.author}
					</div>

					<div className="run-fixes" onClick={this.props.showOutput.bind(null, this.state.fixes)}>
						RUN {this.state.totalFixes} FIXES
					</div>
				</div>

				<ItemContainer allFixes={this.state.fixes} />
			</div>
		);
	}
}
export default Parsefile;
