import React, { Component } from "react";
import "./outputfile.scss";
import ItemContainer from "../../components/ItemContainer";

const fs = require("fs");

class Outputfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rawHtml: "",
			matched: [],
			changed: [],
			all: [],
			author: "",
			fixes: [],
			totalFixes: "",
			exportType: "clean",
			tocType: "yes"
		};
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
		let rawHTML = this.getHTMLText(this.props.htmlpath, fixes);

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

	getHTMLText(path, fixes) {
		let rawHTML = fs.readFileSync(path, "utf8", function read(err, data) {
			return data;
		});

		this.runFixes(rawHTML, fixes);
	}

	runFixes(raw, fixes) {
		let text = raw;
		let result;

		let all = [];
		let changed = [];
		let matched = [];

		fixes.forEach(element => {
			const search = new RegExp(element.search, "gi");
			const replace = element.replace;

			let activeCount = 0;

			while ((result = search.exec(text)) !== null) {
				activeCount++;
			}

			var newObj = {
				info: element.info || "Description not provided",
				search: element.search,
				replace: element.replace,
				occurrences: element.occurrences,
				count: activeCount
			};

			if (activeCount != element.occurrences) {
				changed.push(newObj);
			} else {
				matched.push(newObj);
			}

			all.push(newObj);

			text = text.replace(search, replace);
		});

		this.setState({ rawHtml: text, changed, matched, all });
	}

	render() {
		return (
			<div id="outputfile">
				<div className="top-bar">
					<div className="title">{this.props.jobNumber}</div>
					<div className="sort">
						Changed Occurrences <i className="fas fa-sort" />
					</div>
					<div className="background-bar" />
				</div>

				<ItemContainer allFixes={this.state.changed} />
			</div>
		);
	}
}
export default Outputfile;
