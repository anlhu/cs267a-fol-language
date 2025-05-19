# How to test parser

```
grun fol condition -tree
[YOUR PROGRAM]
^D
```

Example
```
grun fol condition -tree
Thinks(x) -> Is(x)
^D
(condition (formula (formula (pred_constant Thinks) ( (term (ind_constant x)) )) (bin_connective ->) (formula (pred_constant Is) ( (term (ind_constant x)) ))) \n <EOF>)
```