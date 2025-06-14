from ortools.sat.python import cp_model
import itertools
import json
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


class FOLCSPSolver:
    def __init__(self, constants, predicates, functions, constraints):
        """
        Initialize the FOL CSP solver.

        Args:
            constants: List of {id: number, name: string}
            predicates: List of {name: string, data: {paramCount: number, truthTable: dict}, negated: boolean}
            functions: List of {name: string, data: string}
            constraints: List of {code: string, enabled: boolean}
        """
        self.constants = constants
        self.predicates = predicates
        self.functions = functions
        self.constraints = constraints

    def generate_constants(self, num_new_constants):
        """Generate new constant names."""
        return [f"NewConstant{i+1}" for i in range(num_new_constants)]

    def create_model(self, num_new_constants):
        """Create the OR-Tools CP-SAT model."""
        model = cp_model.CpModel()

        # Get all constants (existing + new)
        existing_constants = [c["name"] for c in self.constants]
        new_constants = self.generate_constants(num_new_constants)
        all_constants = existing_constants + new_constants

        # Create variables for each predicate application
        predicate_vars = {}
        for pred in self.predicates:
            name = pred["name"]
            param_count = pred["data"]["paramCount"]
            truth_table = pred["data"]["truthTable"]
            negated = str(pred["negated"]).lower() == "true"

            # Create variables for all possible combinations
            for const_combo in itertools.product(all_constants, repeat=param_count):
                key = ",".join(const_combo)
                var_name = f"{name}({key})"
                predicate_vars[var_name] = model.NewBoolVar(var_name)

                # Add constraints for known truth values
                if key in truth_table:
                    # Convert string "True"/"False" to Python bool
                    value = str(truth_table[key]).lower() == "true"
                    if negated:
                        value = not value
                    model.Add(predicate_vars[var_name] == value)

        # Add constraints from FOL formulas
        for constraint in self.constraints:
            if not str(constraint["enabled"]).lower() == "true":
                continue
            self.add_fol_constraints(
                model, constraint["code"], predicate_vars, all_constants
            )

        return model, predicate_vars, new_constants, existing_constants

    def add_fol_constraints(self, model, fol_formula, predicate_vars, all_constants):
        """
        Add constraints from FOL formula to the model.
        This is a simplified version that handles basic cases.
        """
        fol_formula = fol_formula.strip()
        logger.debug(f"Processing formula: {fol_formula}")

        # Handle negated predicates
        is_negated = fol_formula.startswith("!")
        if is_negated:
            fol_formula = fol_formula[1:].strip()

        # Handle forall quantifier without implication
        if fol_formula.startswith("forall"):
            var = fol_formula[fol_formula.index("(") + 1 : fol_formula.index(")")]
            rest = fol_formula[fol_formula.index(")") + 1 :].strip()
            logger.debug(f"Found forall with var={var}, rest={rest}")

            # Handle nested forall
            if rest.startswith("forall"):
                logger.debug("Found nested forall")
                # Replace first variable
                for const in all_constants:
                    # Replace variable in both predicate arguments and variable declarations
                    new_formula = rest
                    # Replace in predicate arguments
                    new_formula = new_formula.replace(f"{var},", f"{const},")
                    new_formula = new_formula.replace(f"{var})", f"{const})")
                    # Replace in variable declarations
                    new_formula = new_formula.replace(
                        f"forall({var})", f"forall({const})"
                    )
                    logger.debug(
                        f"After substituting {var} with {const}: {new_formula}"
                    )
                    self.add_fol_constraints(
                        model, new_formula, predicate_vars, all_constants
                    )
                return

            # Handle single forall
            for const in all_constants:
                const_formula = rest.replace(f"{var},", f"{const},").replace(
                    f"{var})", f"{const})"
                )
                logger.debug(f"After substituting {var} with {const}: {const_formula}")
                if "->" in const_formula:
                    # Handle implications
                    antecedent, consequent = const_formula.split("->")
                    antecedent = antecedent.strip()
                    consequent = consequent.strip()
                    logger.debug(f"Found implication: {antecedent} -> {consequent}")

                    # Handle conjunction in antecedent
                    if "&&" in antecedent:
                        # Split antecedent into parts and clean up parentheses
                        antecedent = antecedent.strip("()")
                        antecedents = [a.strip() for a in antecedent.split("&&")]
                        logger.debug(f"Found conjunction in antecedent: {antecedents}")

                        # Create a new boolean variable for the AND condition
                        and_var = model.NewBoolVar("and_condition")

                        # Add AND constraint
                        and_terms = []
                        for ant in antecedents:
                            if ant in predicate_vars:
                                and_terms.append(predicate_vars[ant])
                                logger.debug(f"Added term to AND: {ant}")
                        if and_terms:
                            # All terms must be true for the AND to be true
                            model.Add(sum(and_terms) == len(and_terms)).OnlyEnforceIf(
                                and_var
                            )
                            model.Add(sum(and_terms) < len(and_terms)).OnlyEnforceIf(
                                and_var.Not()
                            )

                            # Add implication
                            if consequent in predicate_vars:
                                model.Add(
                                    predicate_vars[consequent] == True
                                ).OnlyEnforceIf(and_var)
                                logger.debug(
                                    f"Added implication: {antecedents} -> {consequent}"
                                )
                    # Handle disjunction in antecedent
                    elif "||" in antecedent:
                        # Split antecedent into parts
                        antecedents = antecedent.split("||")
                        antecedents = [a.strip() for a in antecedents]

                        # Create a new boolean variable for the OR condition
                        or_var = model.NewBoolVar("or_condition")

                        # Add OR constraint
                        or_terms = []
                        for ant in antecedents:
                            if ant in predicate_vars:
                                or_terms.append(predicate_vars[ant])
                        if or_terms:
                            model.Add(sum(or_terms) >= 1).OnlyEnforceIf(or_var)
                            model.Add(sum(or_terms) == 0).OnlyEnforceIf(or_var.Not())

                            # Add implication
                            if consequent in predicate_vars:
                                model.Add(
                                    predicate_vars[consequent] == True
                                ).OnlyEnforceIf(or_var)
                    else:
                        # Handle regular implication
                        if antecedent in predicate_vars:
                            if "&&" in consequent:
                                # Split consequent into parts
                                consequents = consequent.split("&&")
                                consequents = [c.strip() for c in consequents]

                                # Add each part as a separate implication
                                for cons in consequents:
                                    if cons in predicate_vars:
                                        model.Add(
                                            predicate_vars[cons] == True
                                        ).OnlyEnforceIf(predicate_vars[antecedent])
                            else:
                                if consequent in predicate_vars:
                                    model.Add(
                                        predicate_vars[consequent] == True
                                    ).OnlyEnforceIf(predicate_vars[antecedent])
                else:
                    # Handle direct assertions
                    pred_name = const_formula[: const_formula.index("(")]
                    args = const_formula[
                        const_formula.index("(") + 1 : const_formula.index(")")
                    ].split(",")
                    args = [arg.strip() for arg in args]
                    var_name = f"{pred_name}({','.join(args)})"

                    if var_name in predicate_vars:
                        model.Add(predicate_vars[var_name] == True)
            return

        # Handle basic predicate assertions
        if (
            "(" in fol_formula
            and ")" in fol_formula
            and "->" not in fol_formula
            and "&&" not in fol_formula
            and "||" not in fol_formula
        ):
            pred_name = fol_formula[: fol_formula.index("(")]
            args = fol_formula[
                fol_formula.index("(") + 1 : fol_formula.index(")")
            ].split(",")
            args = [arg.strip() for arg in args]

            var_name = f"{pred_name}({','.join(args)})"
            if var_name in predicate_vars:
                model.Add(predicate_vars[var_name] == (not is_negated))

        # Handle implications
        elif "->" in fol_formula:
            antecedent, consequent = fol_formula.split("->")
            antecedent = antecedent.strip()
            consequent = consequent.strip()

            # Handle conjunction in antecedent
            if "&&" in antecedent:
                # Split antecedent into parts
                antecedents = antecedent.split("&&")
                antecedents = [a.strip() for a in antecedents]

                # Create a new boolean variable for the AND condition
                and_var = model.NewBoolVar("and_condition")

                # Add AND constraint
                and_terms = []
                for ant in antecedents:
                    if ant in predicate_vars:
                        and_terms.append(predicate_vars[ant])
                if and_terms:
                    # All terms must be true for the AND to be true
                    model.Add(sum(and_terms) == len(and_terms)).OnlyEnforceIf(and_var)
                    model.Add(sum(and_terms) < len(and_terms)).OnlyEnforceIf(
                        and_var.Not()
                    )

                    # Add implication
                    if consequent in predicate_vars:
                        model.Add(predicate_vars[consequent] == True).OnlyEnforceIf(
                            and_var
                        )
            # Handle disjunction in antecedent
            elif "||" in antecedent:
                # Split antecedent into parts
                antecedents = antecedent.split("||")
                antecedents = [a.strip() for a in antecedents]

                # Create a new boolean variable for the OR condition
                or_var = model.NewBoolVar("or_condition")

                # Add OR constraint
                or_terms = []
                for ant in antecedents:
                    if ant in predicate_vars:
                        or_terms.append(predicate_vars[ant])
                if or_terms:
                    model.Add(sum(or_terms) >= 1).OnlyEnforceIf(or_var)
                    model.Add(sum(or_terms) == 0).OnlyEnforceIf(or_var.Not())

                    # Add implication
                    if consequent in predicate_vars:
                        model.Add(predicate_vars[consequent] == True).OnlyEnforceIf(
                            or_var
                        )
            else:
                # Handle regular implication
                if antecedent in predicate_vars:
                    if "&&" in consequent:
                        # Split consequent into parts
                        consequents = consequent.split("&&")
                        consequents = [c.strip() for c in consequents]

                        # Add each part as a separate implication
                        for cons in consequents:
                            if cons in predicate_vars:
                                model.Add(predicate_vars[cons] == True).OnlyEnforceIf(
                                    predicate_vars[antecedent]
                                )
                    else:
                        if consequent in predicate_vars:
                            model.Add(predicate_vars[consequent] == True).OnlyEnforceIf(
                                predicate_vars[antecedent]
                            )

        # Handle conjunction (&&)
        elif "&&" in fol_formula:
            conjuncts = fol_formula.split("&&")
            for conjunct in conjuncts:
                self.add_fol_constraints(
                    model, conjunct.strip(), predicate_vars, all_constants
                )

        # Handle disjunction (||)
        elif "||" in fol_formula:
            disjuncts = fol_formula.split("||")
            disjuncts = [d.strip() for d in disjuncts]

            # Create a new boolean variable for the OR condition
            or_var = model.NewBoolVar("or_condition")

            # Add OR constraint
            or_terms = []
            for disjunct in disjuncts:
                if disjunct in predicate_vars:
                    or_terms.append(predicate_vars[disjunct])
            if or_terms:
                model.Add(sum(or_terms) >= 1).OnlyEnforceIf(or_var)
                model.Add(sum(or_terms) == 0).OnlyEnforceIf(or_var.Not())

    def solve(self, num_new_constants):
        """
        Solve the CSP and return the solution.

        Returns:
            dict: Solution containing new constants and their predicate assignments
        """
        # Create and solve model
        model, predicate_vars, new_constants, existing_constants = self.create_model(
            num_new_constants
        )
        solver = cp_model.CpSolver()
        status = solver.Solve(model)

        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            # Extract solution
            solution = {"new_constants": new_constants, "predicate_assignments": {}}

            # Get values for predicates involving new constants
            for pred in self.predicates:
                name = pred["name"]
                param_count = pred["data"]["paramCount"]
                all_constants = existing_constants + new_constants

                # Include assignments where any parameter is a new constant
                for const_combo in itertools.product(all_constants, repeat=param_count):
                    key = ",".join(const_combo)
                    var_name = f"{name}({key})"
                    if var_name in predicate_vars:
                        value = bool(solver.Value(predicate_vars[var_name]))
                        if str(pred["negated"]).lower() == "true":
                            value = not value
                        solution["predicate_assignments"][var_name] = value
                        logger.debug(f"Predicate assignment: {var_name} = {value}")

            return solution
        else:
            logger.debug("No solution found")
            return None
