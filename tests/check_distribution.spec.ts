import * as fs from "fs/promises";
import * as path from "path";
import * as jszip from "jszip";

const templateDir = path.join(__dirname, "..", "dist");

describe("check distribution", () => {
	it("check the directory structure of the distribution", async () => {
		const templateZipPaths = (await fs.readdir(templateDir, { withFileTypes: true }))
			.filter(dirent => dirent.isFile() && path.extname(dirent.name) === ".zip")
			.map(dirent => path.join(templateDir, dirent.name));

		if (!templateZipPaths || !templateZipPaths.length) {
			throw new Error("distribution does not exist.");
		}

		for (let templateZipPath of templateZipPaths) {
			const data = await fs.readFile(templateZipPath);
			const zip = await jszip.loadAsync(data);
			const name = path.basename(templateZipPath, path.extname(templateZipPath)); // /path/to/javascript.zip -> javascript

			// root にテンプレート名のディレクトリが存在することを確認
			expect(zip.files[name + "/"]).not.toBeUndefined();
			// テンプレート名のディレクトリ直下に game.json が存在することを確認
			expect(zip.files[name + "/game.json"]).not.toBeUndefined();
		}
	});
});
