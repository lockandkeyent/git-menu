"use babel";

import gitCmd from "../git-cmd";
import helper from "../helper";
import Notifications, { isVerbose } from "../Notifications";

export default {
	label: "Initialize",
	description: "Inizialize a git repo",
	async command(filePaths, statusBar, git = gitCmd, notifications = Notifications) {
		const roots = atom.project.getPaths()
			.filter(dir => (!!dir && filePaths.some(filePath => filePath.startsWith(dir))));
		if (roots.length === 0) {
			throw "No project directory.";
		}

		statusBar.show("Initializing...", null);
		const results = await Promise.all(roots.map(root => git.init(root, isVerbose())));
		notifications.addGit(results.filter(i => i)
			.join("\n\n"));
		atom.project.setPaths(atom.project.getPaths());
		roots.map(root => { helper.refreshAtom(root); });
		return "Git folder" + (results.length > 1 ? "s" : "") + " initialized.";
	},
};