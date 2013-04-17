#!/bin/bash

cat \
lib/codemirror/lib/codemirror.js \
lib/codemirror/mode/javascript/javascript.js \
lib/codemirror/addon/hint/show-hint.js \
lib/codemirror/addon/hint/javascript-hint.js \
lib/acorn/acorn.js \
lib/lodash/lodash.custom.js \
src/tokenizer.js \
src/suggest.js \
src/web.js > src/web.min.js
