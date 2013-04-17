Automark
========

Automark is an experimental Markov-model-style autocompleter, with a [demo](http://omphalos.github.io/automark) of JavaScript autocompletion.

Demo
====

The demo is based on a sampling of JavaScript [n-grams](http://en.wikipedia.org/wiki/N-gram) in the following open-source JavaScript projects:

* [backbone](https://github.com/documentcloud/backbone)
* [d3](https://github.com/mbostock/d3)
* [impress.js](https://github.com/bartaz/impress.js)
* [jquery](https://github.com/jquery/jquery)
* [three.js](https://github.com/mrdoob/three.js)

JavaScript n-grams are constructed by using [acorn](http://marijnhaverbeke.nl/acorn/) to tokenize the JavaScript samples and construct two n-gram trees, one [grammar-based](https://raw.github.com/omphalos/automark/master/db/grammar.js), and one [textual](https://raw.github.com/omphalos/automark/master/db/value.js).

During autocompletion, the trees are traversed and their results combined to provide a short list of suggestions for the programmer.

The code for the UI portion for the demo is based heavily on [CodeMirror's Autocomplete demo](http://codemirror.net/demo/complete.html).

License
=======

MIT
