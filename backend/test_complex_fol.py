import unittest
from fol_csp_solver import FOLCSPSolver


class TestComplexFOLScenarios(unittest.TestCase):
    def test_family_relationships(self):
        """Test complex family relationships with multiple predicates and constraints."""
        constants = [
            {"id": 1, "name": "Zeus"},
            {"id": 2, "name": "Hera"},
            {"id": 3, "name": "Apollo"},
            {"id": 4, "name": "Artemis"},
            {"id": 5, "name": "Leto"},
        ]
        predicates = [
            {
                "name": "God",
                "data": {
                    "paramCount": 1,
                    "truthTable": {
                        "Zeus": True,
                        "Hera": True,
                        "Apollo": True,
                        "Artemis": True,
                        "Leto": True,
                    },
                },
                "negated": False,
            },
            {
                "name": "Parent",
                "data": {
                    "paramCount": 2,
                    "truthTable": {
                        "Zeus,Apollo": True,
                        "Zeus,Artemis": True,
                        "Leto,Apollo": True,
                        "Leto,Artemis": True,
                    },
                },
                "negated": False,
            },
            {
                "name": "Sibling",
                "data": {
                    "paramCount": 2,
                    "truthTable": {"Apollo,Artemis": True, "Artemis,Apollo": True},
                },
                "negated": False,
            },
            {
                "name": "Married",
                "data": {
                    "paramCount": 2,
                    "truthTable": {"Zeus,Hera": True, "Hera,Zeus": True},
                },
                "negated": False,
            },
        ]
        constraints = [
            {
                "code": "forall(x) forall(y) Sibling(x,y) -> God(x) && God(y)",
                "enabled": True,
            },
            {
                "code": "forall(x) forall(y) Parent(x,y) -> God(x) && God(y)",
                "enabled": True,
            },
            {
                "code": "Parent(Zeus,NewConstant1) && Parent(Leto,NewConstant1)",
                "enabled": True,
            },
        ]

        solver = FOLCSPSolver(constants, predicates, [], constraints)
        solution = solver.solve(1)
        self.assertIsNotNone(solution, "Should find a solution")
        self.assertEqual(len(solution["new_constants"]), 1)

        # New constant should be a god (due to parent relationship constraint)
        self.assertTrue(
            solution["predicate_assignments"][f"God({solution['new_constants'][0]})"],
            "New child should be a god",
        )

        # Verify parent relationships
        self.assertTrue(
            solution["predicate_assignments"][
                f"Parent(Zeus,{solution['new_constants'][0]})"
            ],
            "Zeus should be parent of new constant",
        )
        self.assertTrue(
            solution["predicate_assignments"][
                f"Parent(Leto,{solution['new_constants'][0]})"
            ],
            "Leto should be parent of new constant",
        )

    def test_hierarchical_organization(self):
        """Test hierarchical organization with transitive relationships."""
        constants = [
            {"id": 1, "name": "CEO"},
            {"id": 2, "name": "Manager1"},
            {"id": 3, "name": "Manager2"},
            {"id": 4, "name": "Employee1"},
        ]
        predicates = [
            {
                "name": "Reports",
                "data": {
                    "paramCount": 2,
                    "truthTable": {
                        "Manager1,CEO": True,
                        "Manager2,CEO": True,
                        "Employee1,Manager1": True,
                    },
                },
                "negated": False,
            },
            {
                "name": "HasAuthority",
                "data": {
                    "paramCount": 2,
                    "truthTable": {
                        "CEO,Manager1": True,
                        "CEO,Manager2": True,
                        "CEO,Employee1": True,
                        "Manager1,Employee1": True,
                    },
                },
                "negated": False,
            },
        ]
        constraints = [
            {
                "code": "forall(x) forall(y) Reports(x,y) -> HasAuthority(y,x)",
                "enabled": True,
            },
            {
                "code": "forall(x) forall(y) forall(z) (Reports(x,y) && Reports(y,z)) -> HasAuthority(z,x)",
                "enabled": True,
            },
            {
                "code": "Reports(NewConstant1,Manager2) && !Reports(NewConstant1,CEO)",
                "enabled": True,
            },
        ]

        solver = FOLCSPSolver(constants, predicates, [], constraints)
        solution = solver.solve(1)
        self.assertIsNotNone(solution, "Should find a solution")

        # Verify reporting relationship
        self.assertTrue(
            solution["predicate_assignments"][
                f"Reports({solution['new_constants'][0]},Manager2)"
            ],
            "New employee should report to Manager2",
        )
        self.assertFalse(
            solution["predicate_assignments"][
                f"Reports({solution['new_constants'][0]},CEO)"
            ],
            "New employee should not report to CEO",
        )

        # Verify direct authority
        self.assertTrue(
            solution["predicate_assignments"][
                f"HasAuthority(Manager2,{solution['new_constants'][0]})"
            ],
            "Manager2 should have authority over new employee",
        )

        # Verify transitive authority
        self.assertTrue(
            solution["predicate_assignments"][
                f"HasAuthority(CEO,{solution['new_constants'][0]})"
            ],
            "CEO should have authority over new employee through Manager2",
        )

    def test_type_constraints(self):
        """Test type constraints and relationships between different types."""
        constants = [
            {"id": 1, "name": "Human1"},
            {"id": 2, "name": "Tool1"},
            {"id": 3, "name": "Location1"},
        ]
        predicates = [
            {
                "name": "IsHuman",
                "data": {
                    "paramCount": 1,
                    "truthTable": {"Human1": True, "Tool1": False, "Location1": False},
                },
                "negated": False,
            },
            {
                "name": "IsTool",
                "data": {
                    "paramCount": 1,
                    "truthTable": {"Human1": False, "Tool1": True, "Location1": False},
                },
                "negated": False,
            },
            {
                "name": "IsLocation",
                "data": {
                    "paramCount": 1,
                    "truthTable": {"Human1": False, "Tool1": False, "Location1": True},
                },
                "negated": False,
            },
            {
                "name": "Uses",
                "data": {"paramCount": 2, "truthTable": {"Human1,Tool1": True}},
                "negated": False,
            },
            {
                "name": "At",
                "data": {
                    "paramCount": 2,
                    "truthTable": {"Human1,Location1": True, "Tool1,Location1": True},
                },
                "negated": False,
            },
        ]
        constraints = [
            {
                "code": "forall(x) forall(y) Uses(x,y) -> IsHuman(x) && IsTool(y)",
                "enabled": True,
            },
            {
                "code": "forall(x) forall(y) At(x,y) -> (IsHuman(x) || IsTool(x)) && IsLocation(y)",
                "enabled": True,
            },
            {
                "code": "IsHuman(NewConstant1) && Uses(NewConstant1,Tool1) && At(NewConstant1,Location1)",
                "enabled": True,
            },
        ]

        solver = FOLCSPSolver(constants, predicates, [], constraints)
        solution = solver.solve(1)
        self.assertIsNotNone(solution, "Should find a solution")

        # Verify type constraint
        self.assertTrue(
            solution["predicate_assignments"][
                f"IsHuman({solution['new_constants'][0]})"
            ],
            "New constant should be human",
        )
        self.assertFalse(
            solution["predicate_assignments"][
                f"IsTool({solution['new_constants'][0]})"
            ],
            "New constant should not be a tool",
        )
        self.assertFalse(
            solution["predicate_assignments"][
                f"IsLocation({solution['new_constants'][0]})"
            ],
            "New constant should not be a location",
        )

        # Verify relationships
        self.assertTrue(
            solution["predicate_assignments"][
                f"Uses({solution['new_constants'][0]},Tool1)"
            ],
            "New human should use Tool1",
        )
        self.assertTrue(
            solution["predicate_assignments"][
                f"At({solution['new_constants'][0]},Location1)"
            ],
            "New human should be at Location1",
        )


if __name__ == "__main__":
    unittest.main()
