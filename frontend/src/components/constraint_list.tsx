import { Button } from "@mui/material";
import { Box, Card } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useConstraints } from "./context";
import { ConstraintCardContent } from "./constraint_card";

export function ConstraintList() {
  const { constraints, setConstraints } = useConstraints();

  const handleAdd = () => {
    setConstraints([
      ...constraints,
      { code: `// Code for Card ${constraints.length + 1}`, enabled: true },
    ]);
  };
  const handleDelete = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  return (
    <Box overflow="auto" height="100%">
      {constraints.map((_, index) => (
        <Card
          key={index}
          style={{
            width: "calc(100% - 32px)",
            marginBottom: "16px",
          }}
        >
          <ConstraintCardContent num={index} deleteCard={handleDelete} />
        </Card>
      ))}
      <Card style={{ width: "96%" }}>
        <Button fullWidth variant="contained" onClick={handleAdd}>
          Add Constraint <AddIcon />
        </Button>
      </Card>
    </Box>
  );
}
