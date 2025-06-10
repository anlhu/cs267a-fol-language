import {
  Card,
  CardContent,
  Switch,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { green, red } from "@mui/material/colors";
import MonacoEditor from "@monaco-editor/react";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { usePredicates } from "./context";

type Evaluation = {
  predicate: string;
  args: string[];
  value: boolean;
};

type ConstraintCardProps = {
  code: string;
  enabled: boolean;
  satisfied?: boolean;
  error?: string;
  onToggle: () => void;
  onDelete: () => void;
  onCodeChange?: (value: string | undefined) => void;
  index: number;
  evaluations?: Evaluation[];
};

export function ConstraintCard({
  code,
  enabled,
  satisfied,
  error,
  onToggle,
  onDelete,
  onCodeChange,
  index,
  evaluations,
}: ConstraintCardProps) {
  const [showEvaluations, setShowEvaluations] = useState(false);
  const { predicates, setPredicates } = usePredicates();

  useEffect(() => {
    console.log("ConstraintCard props updated:", {
      code,
      enabled,
      satisfied,
      error,
      shouldShowBorder: enabled && satisfied !== undefined,
      borderColor: satisfied ? green[500] : red[500],
      evaluations,
    });
  }, [code, enabled, satisfied, error, evaluations]);

  const handleFlip = (predicateName: string, predicateArgs: string[]) => {
    const concat_args = predicateArgs.join(",");
    setPredicates((prev) =>
      prev.map((p) => {
        if (p.name === predicateName) {
          const hasProp = p.data?.truthTable?.hasOwnProperty(concat_args);
          const currentValue = hasProp
            ? p.data.truthTable[concat_args]
            : p.negated;
          return {
            ...p,
            data: {
              ...p.data,
              truthTable: {
                ...p.data.truthTable,
                [concat_args]: !currentValue,
              },
            },
          };
        }
        return p;
      })
    );
  };

  return (
    <Card
      sx={{
        mb: 2,
        width: "calc(100% - 32px)",
        border:
          enabled && satisfied !== undefined
            ? `2px solid ${satisfied ? green[500] : red[500]}`
            : undefined,
      }}
    >
      <CardContent>
        <Box
          sx={{
            bgcolor: "#d4d4d4",
            padding: "8px",
            borderBottom: "1px solid #ccc",
            mb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>Constraint {index + 1}</Typography>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Switch checked={enabled} onChange={onToggle} />
            {enabled &&
              satisfied !== undefined &&
              (satisfied ? (
                <CheckCircleIcon sx={{ color: green[500] }} />
              ) : (
                <ErrorIcon
                  sx={{ color: red[500], cursor: "pointer" }}
                  onClick={() => setShowEvaluations(!showEvaluations)}
                />
              ))}
            <IconButton size="small" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
        </Box>
        <Box height="200px" overflow="hidden">
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
            theme="vs-dark"
            onChange={onCodeChange}
          />
        </Box>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Error: {error}
          </Typography>
        )}
        {!satisfied && enabled && evaluations && evaluations.length > 0 && (
          <Collapse in={showEvaluations}>
            <Box
              sx={{
                mt: 1,
                p: 1,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                border: "1px solid #ddd",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Predicate Evaluations:
              </Typography>
              {evaluations.map((evaluation, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: evaluation.value ? green[700] : red[700],
                      fontFamily: "monospace",
                    }}
                  >
                    {evaluation.predicate}({evaluation.args.join(", ")}) ={" "}
                    {evaluation.value.toString()}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleFlip(evaluation.predicate, evaluation.args)
                    }
                    title="Flip predicate negation"
                  >
                    <SwapHorizIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
}
