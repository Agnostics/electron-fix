import React, { Component } from "react";
import "./outputfile.scss";
import ItemContainer from "../../components/ItemContainer";

import Donut from "react-animated-donut";

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
			tocType: "yes",
			showChanged: true,
			isSaved: false
		};

		this.changeShowChange = this.changeShowChange.bind(this);
		this.saveHTML = this.saveHTML.bind(this);
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

		let matchCount = 0;
		let moreCount = 0;
		let lessCount = 0;

		fixes.forEach(element => {
			const search = new RegExp(element.search, "gi");
			const replace = element.replace;

			let activeCount = 0;

			while ((result = search.exec(text)) !== null) {
				activeCount++;
			}

			let diffOcc = activeCount - element.occurrences;

			let color = "";

			if (diffOcc > 0) {
				diffOcc = "+" + diffOcc;
				color = "fix-count add";
			} else if (diffOcc < 0) {
				color = "fix-count less";
			} else {
				color = "fix-count match";
			}

			var newObj = {
				info: element.info || "Description not provided",
				search: element.search,
				replace: element.replace,
				occurrences: element.occurrences,
				count: activeCount,
				diff: diffOcc,
				fixcolor: color
			};

			if (activeCount > element.occurrences) moreCount++;
			if (activeCount < element.occurrences) lessCount++;
			if (activeCount == element.occurrences) matchCount++;

			if (activeCount != element.occurrences) {
				changed.push(newObj);
			} else {
				matched.push(newObj);
			}

			all.push(newObj);

			text = text.replace(search, replace);
		});

		this.setState({ rawHtml: text, changed, matched, all, matchCount, lessCount, moreCount });
	}

	changeShowChange() {
		this.setState({ showChanged: !this.state.showChanged });
	}

	saveHTML(e) {
		let path = this.props.htmlpath;

		fs.writeFile(path, this.state.rawHtml, function(err) {
			if (err) throw err;
		});

		this.setState({ isSaved: true });
	}

	render() {
		let isUpdated = "";
		if (this.state.changed.length == 0) {
			this.state.showChanged = false;
			isUpdated = "fix-matched";
		}

		return (
			<div id="outputfile">
				<div className="top-bar">
					<div className="donut">
						<div className="fix-count-number">
							<span style={{ fontSize: "12px", marginBottom: "-10px" }}>Total Fixes</span>
							<br />
							{this.state.totalFixes}
						</div>

						{this.state.all.length > 1 ? (
							<Donut
								data={[
									{ value: this.state.matchCount, color: "#4190de" },
									{ value: this.state.moreCount, color: "#21d79d" },
									{ value: this.state.lessCount, color: "#c05353" }
								]}
								speed={5}
								width={20}
							/>
						) : null}
					</div>
					<div className="title">
						{this.props.jobNumber}
						<div className="byline">created by: {this.state.author}</div>
						<div className="btns">
							<button className={isUpdated}>update fixes</button>{" "}
							{this.state.isSaved ? null : <button onClick={this.saveHTML}>save html</button>}
						</div>
					</div>
					{this.state.isSaved ? <div className="file-saved">HTML SAVED</div> : null}
					<div className="sort" onClick={this.changeShowChange}>
						{this.state.showChanged ? "Changed Occurrences" : "All Occurrences"} <i className="fas fa-sort" />
					</div>
					<div className="background-bar" />
				</div>

				<ItemContainer allFixes={this.state.showChanged ? this.state.changed : this.state.all} />
			</div>
		);
	}
}
export default Outputfile;
