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
  const { constraints } = useConstraints();
  const { constants } = useConstants();
  const { predicates } = usePredicates();
  const { functions } = useFunctions();

  const handleRun = async () => {
    const decoded_enabled_constraints = constraints
      .filter((card) => card.enabled)
      .map((card) => ({
        code: card.code,
        enabled: card.enabled,
      }));

    const payload = {
      decoded_enabled_constraints,
      constants,
      predicates,
      functions,
    };

    try {
      console.log("Sending payload:", payload);
      // Optionally handle response
    } catch (error) {
      // Optionally handle error
      console.error(error);
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
