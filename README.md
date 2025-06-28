# 🦄 ARB Sorter VSCode Extension

A VSCode extension to automatically sort `.arb` files (Application Resource Bundle, used in Flutter localization) according to custom rules and ARB conventions. 

- 🧩 **Keeps global metadata (`@@`) at the top**
- 🗂️ **Sorts keys alphabetically or in reverse, with or without case sensitivity**
- 🔗 **Keeps key and its metadata together**
- 🛡️ **Only applies sorting to `.arb` files, not all JSONs**
- ⚡ **Works with VSCode and forks (VSCodium, Insiders, etc.)**

---

## 🚀 Features
- Sort `.arb` files with one of four modes:
  - Alphabetically (A-Z)
  - Alphabetically (A-Z, Case Sensitive)
  - Reverse (Z-A)
  - Reverse (Z-A, Case Sensitive)
- Command palette integration
- Automatic sort on save (with minimal ARB validation)
- Keeps ARB global metadata at the top
- Keeps translation and its metadata together

---

## 🛠️ Usage
1. **Install the extension**
2. Open any `.arb` file
3. Use the command palette:
   - `ARB: Sort Alphabetically (A-Z)`
   - `ARB: Sort Alphabetically (A-Z, Case Sensitive)`
   - `ARB: Sort Reverse (Z-A)`
   - `ARB: Sort Reverse (Z-A, Case Sensitive)`
4. Or, enable auto-sort on save:
   - Run `ARB: Add sort on save config` in the command palette
   - This will add to your `settings.json`:
     ```json
     "[json]": {
       "editor.codeActionsOnSave": ["source.arbSort"]
     }
     ```
   - Sorting will only apply to `.arb` files, not all JSONs

---

## ⚙️ Configuration

You can set the default sort type for all ARB operations using the `arb-sorter.sortType` setting. This controls how your `.arb` files will be sorted when using code actions, sort-on-save, or the main sort command (unless you pick a specific sort type from the palette).

**Available values:**
- `alpha` – Alphabetically (A-Z, case-insensitive)
- `alphaCase` – Alphabetically (A-Z, case-sensitive)
- `reverse` – Reverse (Z-A, case-insensitive)
- `reverseCase` – Reverse (Z-A, case-sensitive)

**How to change:**
- Open VSCode settings (UI) and search for "ARB Sorter: Sort Type"
- Or, add to your `settings.json`:
  ```json
  "arb-sorter.sortType": "alpha"
  ```
  (Replace `alpha` with your preferred value)

---

## ⚙️ Requirements
- VSCode or compatible fork (VSCodium, Insiders, etc.)
- Node.js >= 18 (for development)

---

## 🧪 Testing
- Run `yarn test` to execute all sort logic tests
- Example ARB file in `test/file_example.arb`

---

## 📄 License
MIT 