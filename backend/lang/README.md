To generate JS targeted parser:

```
antlr4 -Dlanguage=JavaScript -visitor -no-listener fol.g4 -o js
```