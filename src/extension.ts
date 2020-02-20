import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.kkymwriter.preview', () => {
    const panel = vscode.window.createWebviewPanel(
      'catCoding',
      'プレビュー',
      vscode.ViewColumn.Two,
      {}
    );
    // Try preview when this extension is activated the first time
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    // editor.addEventListener()
    let doc = editor.document;
    panel.webview.html = getWebviewContent(doc);

    vscode.workspace.onDidChangeTextDocument(event => {
      panel.webview.html = getWebviewContent(event.document);
    });
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

function convertToHtml(txt: string) {
  return txt.replace(/\n/g, "<br />")
    .replace(/[\|｜](.+?)《(.+?)》/g, '<ruby>$1<rt>$2</rt></ruby>')
    .replace(/[\|｜](.+?)（(.+?)）/g, '<ruby>$1<rt>$2</rt></ruby>')
    .replace(/[\|｜](.+?)\((.+?)\)/g, '<ruby>$1<rt>$2</rt></ruby>')
    /* 漢字の連続の後に括弧が存在した場合、一連の漢字をベーステキスト、括弧内の文字をルビテキストとします。 */
    .replace(/([一-龠]+)《(.+?)》/g, '<ruby>$1<rt>$2</rt></ruby>')
    /* ただし丸括弧内の文字はひらがなかカタカナのみを指定できます。 */
    .replace(/([一-龠]+)（([ぁ-んァ-ヶ]+?)）/g, '<ruby>$1<rt>$2</rt></ruby>')
    .replace(/([一-龠]+)\(([ぁ-んァ-ヶ]+?)\)/g, '<ruby>$1<rt>$2</rt></ruby>')
    /* 括弧を括弧のまま表示したい場合は、括弧の直前に縦棒を入力します。 */
    .replace(/[\|｜]《(.+?)》/g, '《$1》')
    .replace(/[\|｜]（(.+?)）/g, '（$1）')
    .replace(/[\|｜]\((.+?)\)/g, '($1)')
    /* 二重山括弧内を傍点付き文字列に変換する */
    .replace(/《《(.+?)》》/g, function (match, p1, offset, string) {
      var boten = "﹅".repeat(p1.length);
      return "<ruby>" +p1+ "<rt>" + boten + "</rt></ruby>";
    });
}

function getWebviewContent(doc: vscode.TextDocument) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    ` +
    convertToHtml(doc.getText())
    + `
</body>
</html>`;
}