import * as fs from "fs/promises";
import * as path from "path";
import * as util from "util";
import * as childProcess from "child_process";

const exec = util.promisify(childProcess.exec);

const outputDir = path.join(__dirname, "..", "dist");
const templateDir = path.join(__dirname, "..", "templates");

(async () => {
	const templatePaths = (await fs.readdir(templateDir, { withFileTypes: true }))
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);

	const existsZips = (await fs.readdir(outputDir, { withFileTypes: true }))
		.filter(dirent => /\.zip$/.test(dirent.name))
		.map(dirent => path.join(outputDir, dirent.name));
	
	for (let existsZip of existsZips) {
		await fs.unlink(existsZip);
	}

	for (let templatePath of templatePaths) {
		await generateZip(templateDir, templatePath, `${path.basename(templatePath)}.zip`, outputDir);
	}

	console.log("generated template zips successfully.");
})().catch(e => {
	console.log(`failed to generate template zips: ${e.message}`);
	process.exit(1);
});

async function generateZip(cwd: string, dir: string, name: string, output: string): Promise<any> {
	await exec(`zip -r ${name} ${dir}`, { cwd, encoding: "utf-8" });
	await exec(`mv ${name} ${output}`, { cwd, encoding: "utf-8" });
}
