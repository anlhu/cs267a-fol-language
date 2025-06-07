import { Button } from "@mui/material";
import { Toolbar } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  useConstraints,
  useConstants,
  usePredicates,
  useFunctions,
} from "./context";

export function AppToolbar() {
  const { constraints, setConstraints } = useConstraints();
  const { constants } = useConstants();
  const { predicates } = usePredicates();
  const { functions } = useFunctions();

  const handleRun = async () => {
    console.log("Current constraints:", constraints);
    
    const decoded_enabled_constraints = constraints
      .filter((card) => card.enabled)
      .map((card) => ({
        code: card.code,
        enabled: card.enabled,
      }));

    // Don't make API call if there are no enabled constraints
    if (decoded_enabled_constraints.length === 0) {
      console.log('No enabled constraints to evaluate');
      return;
    }

    const payload = {
      constraints: decoded_enabled_constraints,
      constants,
      predicates,
      functions,
    };

    try {
      console.log("Sending payload:", payload);
      const response = await fetch('http://localhost:8080/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to evaluate FOL rules');
      }

      const { results } = await response.json();
      console.log('Evaluation results:', results);
      
      // Update constraints with evaluation results
      const updatedConstraints = constraints.map((constraint, index) => {
        if (!constraint.enabled) return constraint;
        const result = results[`Rule ${index + 1}`];
        const updated = {
          ...constraint,
          satisfied: result?.satisfied ?? true,
          error: result?.error,
          evaluations: result?.evaluations
        };
        console.log(`Constraint ${index + 1}:`, { 
          before: constraint,
          after: updated,
          result
        });
        return updated;
      });
      
      console.log("Setting updated constraints:", updatedConstraints);
      setConstraints(updatedConstraints);
    } catch (error) {
      console.error('Error evaluating FOL rules:', error);
      // TODO: Show error in UI
    }
  };

  return (
    <Toolbar style={{ justifyContent: "center" }}>
      <Button color="inherit" variant="outlined" onClick={handleRun}>
        Run <PlayArrowIcon />
      </Button>
    </Toolbar>
  );
}
