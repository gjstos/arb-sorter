const vscode = require("vscode");

function sortArb(type, editor) {
  const doc = editor.document;
  if (!doc.fileName.toLowerCase().endsWith(".arb")) {
    return; // Only apply sort to .arb files
  }

  const text = doc.getText();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    return vscode.window.showErrorMessage("Error parsing JSON.");
  }

  const globalMeta = {};
  const entries = [];
  for (const key of Object.keys(parsed)) {
    if (key.startsWith("@@")) {
      globalMeta[key] = parsed[key];
    } else if (!key.startsWith("@")) {
      const entry = { key, value: parsed[key] };
      const metaKey = `@${key}`;
      if (parsed.hasOwnProperty(metaKey)) {
        entry.meta = parsed[metaKey];
      }
      entries.push(entry);
    }
  }
  if (type === "alpha") {
    entries.sort((a, b) => a.key.localeCompare(b.key));
  } else if (type === "alphaCase") {
    entries.sort((a, b) => a.key.localeCompare(b.key, undefined, { sensitivity: "case" }));
  } else if (type === "reverse") {
    entries.sort((a, b) => b.key.localeCompare(a.key));
  } else if (type === "reverseCase") {
    entries.sort((a, b) => b.key.localeCompare(a.key, undefined, { sensitivity: "case" }));
  }
  const sorted = { ...globalMeta };
  for (const entry of entries) {
    sorted[entry.key] = entry.value;
    if (entry.meta !== undefined) {
      sorted[`@${entry.key}`] = entry.meta;
    }
  }
  const formatted = JSON.stringify(sorted, null, 2);
  const fullRange = new vscode.Range(
    doc.positionAt(0),
    doc.positionAt(text.length)
  );
  return { formatted, fullRange };
}

function getSortType() {
  const config = vscode.workspace.getConfiguration("arb-sorter");
  return config.get("sortType", "alpha");
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("arbSorter.sortAlpha", async function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return vscode.window.showErrorMessage("No active editor.");
      }
      const { formatted, fullRange } = sortArb("alpha", editor);
      editor.edit(editBuilder => {
        editBuilder.replace(fullRange, formatted);
      });
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("arbSorter.sortAlphaCase", async function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return vscode.window.showErrorMessage("No active editor.");
      }
      const { formatted, fullRange } = sortArb("alphaCase", editor);
      editor.edit(editBuilder => {
        editBuilder.replace(fullRange, formatted);
      });
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("arbSorter.sortReverse", async function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return vscode.window.showErrorMessage("No active editor.");
      }
      const { formatted, fullRange } = sortArb("reverse", editor);
      editor.edit(editBuilder => {
        editBuilder.replace(fullRange, formatted);
      });
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("arbSorter.sortReverseCase", async function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return vscode.window.showErrorMessage("No active editor.");
      }
      const { formatted, fullRange } = sortArb("reverseCase", editor);
      editor.edit(editBuilder => {
        editBuilder.replace(fullRange, formatted);
      });
    })
  );

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { pattern: "**/*.arb" },
      {
        provideCodeActions(document, range, context, token) {
          return [
            {
              title: "Sort ARB File",
              kind: vscode.CodeActionKind.Source.append("arbSort"),
              command: {
                command: "arbSorter.codeActionSort",
                title: "Sort ARB File",
                arguments: [document]
              }
            }
          ];
        }
      },
      {
        providedCodeActionKinds: [vscode.CodeActionKind.Source.append("arbSort")]
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("arbSorter.codeActionSort", async function (document) {
      const editor = await vscode.window.showTextDocument(document);
      const sortType = getSortType();
      const { formatted, fullRange } = sortArb(sortType, editor) || {};
      if (formatted && fullRange) {
        await editor.edit(editBuilder => {
          editBuilder.replace(fullRange, formatted);
        });
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("arbSorter.addSortOnSaveConfig", async function () {
      try {
        const sortType = getSortType();
        const config = vscode.workspace.getConfiguration();
        const key = "[json]";
        let current = config.get(key) || {};
        let actions = current["editor.codeActionsOnSave"] || [];
        actions = actions.filter(a => a !== "source.arbSort");
        actions.push("source.arbSort");
        current["editor.codeActionsOnSave"] = actions;
        await config.update(key, current, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Sort-on-save configuration for ARB (${sortType}) added to settings.json in [json]!`);
      } catch (e) {
        vscode.window.showErrorMessage("Error adding configuration: " + e.message);
      }
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};