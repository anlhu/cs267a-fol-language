import { Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import {
  useConstraints,
  useConstants,
  usePredicates,
  useFunctions,
} from "./context";
import { Box } from "@mui/material";

export function GenerateData() {
  const { constraints } = useConstraints();
  const { constants } = useConstants();
  const { predicates } = usePredicates();
  const { functions } = useFunctions();
  const [numConstants, setNumConstants] = useState<number>(1);

  const handleGenerateData = async () => {
    console.log("Generating data for", numConstants, "constants");

    const decoded_enabled_constraints = constraints
      .filter((card) => card.enabled)
      .map((card, index) => ({
        number: index + 1,
        code: card.code,
        enabled: card.enabled,
      }));

    // Don't make API call if there are no enabled constraints
    if (decoded_enabled_constraints.length === 0) {
      console.log("No enabled constraints to evaluate");
      return;
    }

    const payload = {
      constraints: decoded_enabled_constraints,
      constants,
      predicates,
      functions,
      numConstants,
    };

    try {
      console.log("Sending payload:", payload);
      const response = await fetch("http://localhost:8080/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate data");
      }

      const result = await response.json();
      console.log("Generation result:", result);
      
      // TODO: Handle the generated data
      
    } catch (error) {
      console.error("Error generating data:", error);
      // TODO: Show error in UI
    }
  };

  const handleNumConstantsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setNumConstants(value);
    }
  };

  return (
    <Box borderTop="2px solid #888">
      <Box
        height="40px"
        bgcolor="#d4d4d4"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        Generate Data
      </Box>
      <Box
        padding="16px"
        display="flex"
        alignItems="center"
        gap={2}
      >
        <TextField
          label="Number of Constants"
          type="number"
          size="small"
          value={numConstants}
          onChange={handleNumConstantsChange}
          inputProps={{ min: 1 }}
          style={{ width: 150 }}
        />
        <Button 
          sx={{
            bgcolor: "#d4d4d4",
            "&:hover": {
              bgcolor: "#bdbdbd"
            }
          }}
          variant="contained" 
          onClick={handleGenerateData}
          startIcon={<AddIcon />}
        >
          Generate Data
        </Button>
      </Box>
    </Box>
  );
} 