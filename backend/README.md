# FOL CSP Solver Tests

This directory contains tests for the First Order Logic (FOL) Constraint Satisfaction Problem (CSP) solver.

## Requirements

- Python 3.6+
- Google OR-Tools (`pip install ortools`)

## Running Tests

1. Run all tests with examples:

```bash
python3 run_fol_tests.py
```

2. Run just the unit tests:

```bash
python3 -m unittest test_fol_csp.py
```

## Test Cases

The test suite includes:

1. Basic Generation

   - Generate a single constant with no constraints
   - Verify basic solver functionality

2. Predicate Constraints

   - Test God(x) predicate
   - Test !Human(x) predicate
   - Test Parent(x,y) relationship

3. Universal Quantification

   - Test forall(x) with implications
   - Verify constraint satisfaction across all constants

4. Multiple Constants

   - Generate multiple related constants
   - Test relationships between new constants

5. Unsatisfiable Constraints
   - Verify solver handles impossible constraints
   - Check error handling

## Example Usage

The `run_fol_tests.py` script includes example usage showing how to:

1. Set up the solver with a context
2. Add constraints
3. Generate new constants
4. Handle the solution

## Debugging

If tests fail, check:

1. OR-Tools installation
2. Python version
3. Input format of constraints
4. Predicate truth tables
