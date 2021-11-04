# templates

Akashic ゲームのテンプレートリポジトリ。

## template-list.json

このリポジトリが提供するテンプレートリスト一覧は以下になります。

* [template-list.json](https://akashic-contents.github.io/templates/template-list.json)
  * `javascript`
  * `javascript-minimal`
  * `javascript-shin-ichiba-ranking`
  * `typescript`
  * `typescript-minimal`
  * `typescript-shin-ichiba-ranking`

## 開発者向け

### リリース

[こちら](https://github.com/akashic-contents/templates/actions/workflows/release.yml) から手動でリリースすることができます。

### ZIP ファイルの生成

以下コマンドを実行すると `./templates` 以下の各ディレクトリを ZIP 圧縮したファイルが `./dist` 以下に生成されます。

```sh
npm run generate
```

### 成果物のテスト

以下コマンドで成果物の妥当性チェックをします。
テスト実行前に成果物を生成しておく必要があります。

```sh
npm run generate
npm test
```
