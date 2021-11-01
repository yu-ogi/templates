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
		.map(dirent => path.join(templateDir, dirent.name));

	const existsZips = (await fs.readdir(outputDir, { withFileTypes: true }))
		.filter(dirent => /\.zip$/.test(dirent.name))
		.map(dirent => path.join(outputDir, dirent.name));
	
	for (let existsZip of existsZips) {
		await fs.unlink(existsZip);
	}

	for (let templatePath of templatePaths) {
		await generateZip(templatePath, `${path.basename(templatePath)}.zip`, outputDir);
	}

	console.log("generated template zips successfully.");
})().catch(e => {
	console.log(`failed to generate template zips: ${e.message}`);
	process.exit(1);
});

// NOTE: dir は絶対パスまたは output からの相対パスを指定する点に注意
function generateZip(dir: string, name: string, output: string): Promise<any> {
	return exec(`zip -r ${name} ${dir}`, { cwd: output, encoding: "utf-8" });
}
