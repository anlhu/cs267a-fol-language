import { Button } from "@mui/material";
import { Box, Card } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useConstraints } from "./context";
import { ConstraintCard } from "./ConstraintCard";

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

  const handleToggle = (index: number) => {
    setConstraints((prev) =>
      prev.map((c, i) => (i === index ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleCodeChange = (index: number, value: string | undefined) => {
    setConstraints((prev) =>
      prev.map((c, i) => (i === index ? { ...c, code: value ?? "" } : c))
    );
  };

  return (
    <Box overflow="auto" height="100%">
      {constraints.map((constraint, index) => (
        <ConstraintCard
          key={index}
          code={constraint.code}
          enabled={constraint.enabled}
          satisfied={constraint.satisfied}
          error={constraint.error}
          onToggle={() => handleToggle(index)}
          onDelete={() => handleDelete(index)}
          onCodeChange={(value) => handleCodeChange(index, value)}
          index={index}
          evaluations={constraint.evaluations}
          explanation={constraint.explanation}
        />
      ))}
      <Card style={{ width: "96%" }}>
        <Button fullWidth variant="contained" onClick={handleAdd}>
          Add Constraint <AddIcon />
        </Button>
      </Card>
    </Box>
  );
}
