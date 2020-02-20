// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, TextDocument } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "kkymwriter" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.kkymwriter.preview', () => {
    // Create and show panel
    const panel = vscode.window.createWebviewPanel(
      'catCoding',
      'プレビュー',
      vscode.ViewColumn.Two,
      {}
    );
    // Try preview when this extension is activated the first time
    let editor = window.activeTextEditor;
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

function getWebviewContent(doc: TextDocument) {
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