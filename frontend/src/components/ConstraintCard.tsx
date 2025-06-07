import { Card, CardContent, Switch, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { green, red } from "@mui/material/colors";
import MonacoEditor from "@monaco-editor/react";
import { Box } from "@mui/material";
import { useEffect } from "react";

type ConstraintCardProps = {
  code: string;
  enabled: boolean;
  satisfied?: boolean;
  error?: string;
  onToggle: () => void;
  onDelete: () => void;
  onCodeChange?: (value: string | undefined) => void;
  index: number;
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
}: ConstraintCardProps) {
  // Debug prop changes
  useEffect(() => {
    console.log("ConstraintCard props updated:", {
      code,
      enabled,
      satisfied,
      error,
      shouldShowBorder: enabled && satisfied !== undefined,
      borderColor: satisfied ? green[500] : red[500]
    });
  }, [code, enabled, satisfied, error]);

  return (
    <Card 
      sx={{ 
        mb: 2,
        width: "calc(100% - 32px)",
        border: enabled && satisfied !== undefined ? 
          `2px solid ${satisfied ? green[500] : red[500]}` : 
          undefined
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
            alignItems: "center"
          }}
        >
          <Typography>Constraint {index + 1}</Typography>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Switch checked={enabled} onChange={onToggle} />
            {enabled && satisfied !== undefined && (
              satisfied ? 
                <CheckCircleIcon sx={{ color: green[500] }} /> :
                <ErrorIcon sx={{ color: red[500] }} />
            )}
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
      </CardContent>
    </Card>
  );
} 