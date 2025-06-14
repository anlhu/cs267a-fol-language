from fol_csp_solver import FOLCSPSolver
import unittest


class TestFOLCSPSolver(unittest.TestCase):
    def setUp(self):
        self.test_context = {
            "constants": [
                {"id": 1, "name": "Zeus"},
                {"id": 2, "name": "Hera"},
                {"id": 3, "name": "Apollo"},
            ],
            "predicates": [
                {
                    "name": "God",
                    "data": {
                        "paramCount": 1,
                        "truthTable": {"Zeus": True, "Hera": True, "Apollo": True},
                    },
                    "negated": False,
                },
                {
                    "name": "Human",
                    "data": {
                        "paramCount": 1,
                        "truthTable": {"Zeus": False, "Hera": False, "Apollo": False},
                    },
                    "negated": False,
                },
                {
                    "name": "Parent",
                    "data": {
                        "paramCount": 2,
                        "truthTable": {
                            "Zeus,Apollo": True,
                            "Hera,Apollo": True,
                            "Zeus,Hera": False,
                            "Apollo,Zeus": False,
                        },
                    },
                    "negated": False,
                },
            ],
            "functions": [],
        }

    def test_basic_generation(self):
        """Test generating a single new constant with no constraints."""
        solver = FOLCSPSolver(
            constants=self.test_context["constants"],
            predicates=self.test_context["predicates"],
            functions=self.test_context["functions"],
            constraints=[],
        )

        solution = solver.solve(num_new_constants=1)
        self.assertIsNotNone(solution)
        self.assertEqual(len(solution["new_constants"]), 1)
        self.assertIn("NewConstant1", solution["new_constants"])

    def test_god_constraint(self):
        """Test generating a constant that must be a god."""
        solver = FOLCSPSolver(
            constants=self.test_context["constants"],
            predicates=self.test_context["predicates"],
            functions=self.test_context["functions"],
            constraints=[{"code": "God(NewConstant1)", "enabled": True, "number": 1}],
        )

        solution = solver.solve(num_new_constants=1)
        self.assertIsNotNone(solution)
        self.assertTrue(solution["predicate_assignments"]["God(NewConstant1)"])

    def test_not_human_constraint(self):
        """Test generating a constant that must not be human."""
        solver = FOLCSPSolver(
            constants=self.test_context["constants"],
            predicates=self.test_context["predicates"],
            functions=self.test_context["functions"],
            constraints=[
                {"code": "!Human(NewConstant1)", "enabled": True, "number": 1}
            ],
        )

        solution = solver.solve(num_new_constants=1)
        self.assertIsNotNone(solution)
        self.assertFalse(solution["predicate_assignments"]["Human(NewConstant1)"])

    def test_parent_relationship(self):
        """Test generating a constant with parent relationship constraints."""
        constants = [
            {"id": 1, "name": "Zeus"},
            {"id": 2, "name": "Hera"},
            {"id": 3, "name": "Apollo"},
        ]
        predicates = [
            {
                "name": "God",
                "data": {
                    "paramCount": 1,
                    "truthTable": {"Zeus": True, "Hera": True, "Apollo": True},
                },
                "negated": False,
            },
            {
                "name": "Human",
                "data": {
                    "paramCount": 1,
                    "truthTable": {"Zeus": False, "Hera": False, "Apollo": False},
                },
                "negated": False,
            },
            {
                "name": "Parent",
                "data": {
                    "paramCount": 2,
                    "truthTable": {
                        "Zeus,Apollo": True,
                        "Hera,Apollo": True,
                        "Zeus,Hera": False,
                        "Apollo,Zeus": False,
                    },
                },
                "negated": False,
            },
        ]
        constraints = [
            {"code": "Parent(Zeus,NewConstant1)", "enabled": True, "number": 1}
        ]
        solver = FOLCSPSolver(constants, predicates, [], constraints)
        solution = solver.solve(1)
        self.assertIsNotNone(
            solution, "Should find a solution with parent relationship"
        )
        # The solution should include the new constant
        self.assertEqual(
            len(solution["new_constants"]), 1, "Should generate exactly 1 new constant"
        )
        # The parent relationship should be established
        # Check that the solution includes assignments for the new constant
        self.assertIn("new_constants", solution)
        self.assertGreater(len(solution["new_constants"]), 0)
        # Check that we have predicate assignments
        self.assertIn("predicate_assignments", solution)
        # Check that the parent relationship is established
        found_parent_relationship = False
        for key, value in solution["predicate_assignments"].items():
            if key.startswith("Parent(Zeus,") and value:
                found_parent_relationship = True
                break
        self.assertTrue(
            found_parent_relationship, "Should establish parent relationship with Zeus"
        )

    def test_forall_constraint(self):
        """Test generating constants with universal quantification."""
        solver = FOLCSPSolver(
            constants=self.test_context["constants"],
            predicates=self.test_context["predicates"],
            functions=self.test_context["functions"],
            constraints=[
                {"code": "forall(x) God(x) -> !Human(x)", "enabled": True, "number": 1}
            ],
        )

        solution = solver.solve(num_new_constants=2)
        self.assertIsNotNone(solution)

        # Check that no constant is both god and human
        for const in solution["new_constants"]:
            if solution["predicate_assignments"].get(f"God({const})", False):
                self.assertFalse(
                    solution["predicate_assignments"].get(f"Human({const})", True)
                )

    def test_multiple_constants(self):
        """Test generating multiple constants with relationships."""
        solver = FOLCSPSolver(
            constants=self.test_context["constants"],
            predicates=self.test_context["predicates"],
            functions=self.test_context["functions"],
            constraints=[
                {
                    "code": "Parent(NewConstant1,NewConstant2)",
                    "enabled": True,
                    "number": 1,
                },
                {
                    "code": "God(NewConstant1) && God(NewConstant2)",
                    "enabled": True,
                    "number": 2,
                },
            ],
        )

        solution = solver.solve(num_new_constants=2)
        self.assertIsNotNone(solution)
        self.assertTrue(
            solution["predicate_assignments"]["Parent(NewConstant1,NewConstant2)"]
        )
        self.assertTrue(solution["predicate_assignments"]["God(NewConstant1)"])
        self.assertTrue(solution["predicate_assignments"]["God(NewConstant2)"])

    def test_unsatisfiable_constraints(self):
        """Test that unsatisfiable constraints return None."""
        solver = FOLCSPSolver(
            constants=self.test_context["constants"],
            predicates=self.test_context["predicates"],
            functions=self.test_context["functions"],
            constraints=[
                {
                    "code": "God(NewConstant1) && Human(NewConstant1)",
                    "enabled": True,
                    "number": 1,
                }
            ],
        )

        solution = solver.solve(num_new_constants=1)
        self.assertIsNone(solution)

    def test_simple_predicate(self):
        """Test a simple predicate assertion"""
        constants = [{"id": 1, "name": "Zeus"}]
        predicates = [
            {
                "name": "God",
                "data": {"paramCount": 1, "truthTable": {"Zeus": "True"}},
                "negated": "False",
            }
        ]
        constraints = [{"code": "God(Zeus)", "enabled": "True"}]
        solver = FOLCSPSolver(constants, predicates, [], constraints)
        solution = solver.solve(0)
        self.assertIsNotNone(solution, "Should find a solution for simple predicate")

    def test_multiple_predicates(self):
        """Test multiple predicates with relationships"""
        constants = [{"id": 1, "name": "Zeus"}, {"id": 2, "name": "Apollo"}]
        predicates = [
            {
                "name": "God",
                "data": {
                    "paramCount": 1,
                    "truthTable": {"Zeus": "True", "Apollo": "True"},
                },
                "negated": "False",
            },
            {
                "name": "Parent",
                "data": {"paramCount": 2, "truthTable": {"Zeus,Apollo": "True"}},
                "negated": "False",
            },
        ]
        constraints = [{"code": "God(Zeus) && Parent(Zeus,Apollo)", "enabled": "True"}]
        solver = FOLCSPSolver(constants, predicates, [], constraints)
        solution = solver.solve(0)
        self.assertIsNotNone(solution, "Should find a solution for multiple predicates")

    def test_negated_predicate(self):
        """Test negated predicates"""
        constants = [{"id": 1, "name": "Zeus"}, {"id": 2, "name": "Mortal1"}]
        predicates = [
            {
                "name": "God",
                "data": {
                    "paramCount": 1,
                    "truthTable": {"Zeus": "True", "Mortal1": "False"},
                },
                "negated": "False",
            }
        ]
        constraints = [{"code": "!God(Mortal1)", "enabled": "True"}]
        solver = FOLCSPSolver(constants, predicates, [], constraints)
        solution = solver.solve(0)
        self.assertIsNotNone(solution, "Should find a solution with negated predicate")

    def test_new_constants(self):
        """Test generating new constants"""
        constants = [{"id": 1, "name": "Zeus"}]
        predicates = [
            {
                "name": "God",
                "data": {"paramCount": 1, "truthTable": {"Zeus": "True"}},
                "negated": "False",
            }
        ]
        constraints = [{"code": "God(Zeus)", "enabled": "True"}]
        solver = FOLCSPSolver(constants, predicates, [], constraints)
        solution = solver.solve(2)  # Generate 2 new constants
        self.assertIsNotNone(solution, "Should find a solution with new constants")
        self.assertEqual(
            len(solution["new_constants"]), 2, "Should generate exactly 2 new constants"
        )

    def test_implication_constraint(self):
        """Test implication constraints"""
        constants = [{"id": 1, "name": "Zeus"}, {"id": 2, "name": "Apollo"}]
        predicates = [
            {
                "name": "God",
                "data": {
                    "paramCount": 1,
                    "truthTable": {"Zeus": "True", "Apollo": "True"},
                },
                "negated": "False",
            },
            {
                "name": "Immortal",
                "data": {
                    "paramCount": 1,
                    "truthTable": {"Zeus": "True", "Apollo": "True"},
                },
                "negated": "False",
            },
        ]
        constraints = [{"code": "God(Zeus) -> Immortal(Zeus)", "enabled": "True"}]
        solver = FOLCSPSolver(constants, predicates, [], constraints)
        solution = solver.solve(0)
        self.assertIsNotNone(solution, "Should find a solution with implication")

    def test_forall_constraint(self):
        """Test universal quantification"""
        constants = [
            {"id": 1, "name": "Zeus"},
            {"id": 2, "name": "Apollo"},
            {"id": 3, "name": "Athena"},
        ]
        predicates = [
            {
                "name": "God",
                "data": {
                    "paramCount": 1,
                    "truthTable": {"Zeus": "True", "Apollo": "True", "Athena": "True"},
                },
                "negated": "False",
            },
            {
                "name": "Immortal",
                "data": {
                    "paramCount": 1,
                    "truthTable": {"Zeus": "True", "Apollo": "True", "Athena": "True"},
                },
                "negated": "False",
            },
        ]
        constraints = [{"code": "forall(x) God(x) -> Immortal(x)", "enabled": "True"}]
        solver = FOLCSPSolver(constants, predicates, [], constraints)
        solution = solver.solve(0)
        self.assertIsNotNone(solution, "Should find a solution with forall quantifier")

    def test_unsatisfiable_constraints(self):
        """Test handling of unsatisfiable constraints"""
        constants = [{"id": 1, "name": "Zeus"}]
        predicates = [
            {
                "name": "Mortal",
                "data": {"paramCount": 1, "truthTable": {"Zeus": "False"}},
                "negated": "False",
            }
        ]
        constraints = [{"code": "Mortal(Zeus)", "enabled": "True"}]
        solver = FOLCSPSolver(constants, predicates, [], constraints)
        solution = solver.solve(0)
        self.assertIsNone(solution, "Should return None for unsatisfiable constraints")

    def test_complex_scenario(self):
        """Test a complex scenario with multiple predicates, constants, and constraints"""
        constants = [
            {"id": 1, "name": "Zeus"},
            {"id": 2, "name": "Apollo"},
            {"id": 3, "name": "Hera"},
        ]
        predicates = [
            {
                "name": "God",
                "data": {
                    "paramCount": 1,
                    "truthTable": {"Zeus": "True", "Apollo": "True", "Hera": "True"},
                },
                "negated": "False",
            },
            {
                "name": "Parent",
                "data": {
                    "paramCount": 2,
                    "truthTable": {"Zeus,Apollo": "True", "Hera,Apollo": "True"},
                },
                "negated": "False",
            },
            {
                "name": "Likes",
                "data": {
                    "paramCount": 2,
                    "truthTable": {"Apollo,Zeus": "True", "Zeus,Hera": "True"},
                },
                "negated": "False",
            },
        ]
        functions = [
            {
                "name": "spouse",
                "data": """def spouse(x):
                if x == "Zeus": return "Hera"
                elif x == "Hera": return "Zeus"
                else: return None""",
            }
        ]
        constraints = [
            {"code": "God(Zeus) && Parent(Zeus,Apollo)", "enabled": "True"},
            {"code": "Likes(Apollo,Zeus) -> God(Zeus)", "enabled": "True"},
            {"code": "forall(x) Parent(Zeus,x) -> God(x)", "enabled": "True"},
        ]
        solver = FOLCSPSolver(constants, predicates, functions, constraints)
        solution = solver.solve(1)
        self.assertIsNotNone(solution, "Should find a solution for complex scenario")
        self.assertEqual(
            len(solution["new_constants"]), 1, "Should generate 1 new constant"
        )

    def test_disabled_constraints(self):
        """Test that disabled constraints are ignored"""
        constants = [{"id": 1, "name": "Zeus"}]
        predicates = [
            {
                "name": "Mortal",
                "data": {"paramCount": 1, "truthTable": {"Zeus": "False"}},
                "negated": "False",
            }
        ]
        constraints = [
            {
                "code": "Mortal(Zeus)",
                "enabled": "False",
            },  # This would make it unsatisfiable if enabled
        ]
        solver = FOLCSPSolver(constants, predicates, [], constraints)
        solution = solver.solve(0)
        self.assertIsNotNone(
            solution, "Should find a solution when conflicting constraint is disabled"
        )

    def test_transitive_relationship(self):
        """Test handling of transitive relationships (e.g., if A has authority over B, and B has authority over C, then A has authority over C)"""
        constants = [
            {"id": 1, "name": "CEO"},
            {"id": 2, "name": "Manager"},
            {"id": 3, "name": "Employee"},
        ]
        predicates = [
            {
                "name": "HasAuthority",
                "data": {
                    "paramCount": 2,
                    "truthTable": {"CEO,Manager": True, "Manager,Employee": True},
                },
                "negated": False,
            }
        ]
        constraints = [
            {
                "code": "forall(x) forall(y) forall(z) (HasAuthority(x,y) && HasAuthority(y,z)) -> HasAuthority(x,z)",
                "enabled": True,
                "number": 1,
            }
        ]
        solver = FOLCSPSolver(constants, predicates, [], constraints)
        solution = solver.solve(0)
        self.assertIsNotNone(
            solution, "Should find a solution with transitive relationships"
        )
        self.assertTrue(
            solution["predicate_assignments"]["HasAuthority(CEO,Employee)"],
            "CEO should have authority over Employee through Manager",
        )


if __name__ == "__main__":
    unittest.main()
