import * as fs from "fs/promises";
import * as path from "path";
import * as util from "util";
import * as childProcess from "child_process";

const exec = util.promisify(childProcess.exec);

const outputDir = path.join(__dirname, "..", "dist");
const templateDir = path.join(__dirname, "..", "templates");

(async () => {
	const templatePaths = (await fs.readdir(templateDir, { withFileTypes: true }))
		.filter(direct => direct.isDirectory())
		.map(direct => path.join(templateDir, direct.name));

	const existsZips = (await fs.readdir(outputDir, { withFileTypes: true }))
		.filter(direct => /\.zip$/.test(direct.name))
		.map(direct => path.join(outputDir, direct.name));
	
	for (let existsZip of existsZips) {
		await fs.unlink(existsZip);
	}

	for (let templateDir of templatePaths) {
		await generateZip(templateDir, `${path.basename(templateDir)}.zip`, outputDir);
	}

	console.log("generated template zips successfully.");
})().catch(e => {
	console.log(`failed to generate template zips: ${e.message}`);
	process.exit(1);
});

function generateZip(dir: string, name: string, output: string): Promise<any> {
	return exec(`zip -r ${name} ${dir}`, { cwd: output, encoding: "utf-8" });
}
