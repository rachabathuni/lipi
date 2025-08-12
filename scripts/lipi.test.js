const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

// Minimal localStorage mock
const localStorage = {
  getItem(key) { return this[key] ?? null; },
  removeItem(key) { delete this[key]; }
};

// Selection and text mocks
let selection = { start: 0, end: 1 };
let text = 'abc';
const document = {};

function $(selector) {
  if (selector === '#edit') {
    return {
      get: () => ({ selectionStart: selection.start, selectionEnd: selection.end }),
      val: () => text
    };
  }
  return { ready: () => {} };
}

// Execute lipi.js in this context
const context = {
  localStorage,
  $, // jQuery mock
  console,
  window: {},
  document: {}
};
vm.createContext(context);
const code = fs.readFileSync(__dirname + '/lipi.js', 'utf8');
vm.runInContext(code, context);
context.updateShortcutsMenu = () => {};
context.hideShortcutMenu = () => {};
context.showShortcutMenu = () => {};

// Allowed key should create shortcut
context.saveShortcut('!');
assert.strictEqual(localStorage['shortcut_1'], 'a');

// Disallowed key should not create shortcut
localStorage.removeItem('shortcut_1');
context.saveShortcut('a');
assert.strictEqual(localStorage['shortcut_1'], undefined);

console.log('saveShortcut key validation tests passed');
