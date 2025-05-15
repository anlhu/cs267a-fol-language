import { Button } from "@mui/material";
import MonacoEditor from "@monaco-editor/react";
import { useRef } from "react";
import { Box, CardContent } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConstraints } from "./context";

export function ConstraintCardContent({
  num,
  deleteCard,
}: {
  num: number;
  deleteCard: (arg0: number) => void;
}) {
  const { constraints, setConstraints } = useConstraints();
  const editorRef = useRef<any>(null);

  const enabled = constraints[num]?.enabled ?? true;
  const code = constraints[num]?.code ?? "";

  const handleSwitch = () => {
    setConstraints((prev) =>
      prev.map((c, i) => (i === num ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    setConstraints((prev) =>
      prev.map((c, i) => (i === num ? { ...c, code: value ?? "" } : c))
    );
  };

  return (
    <CardContent style={{ padding: "0" }}>
      <Box
        bgcolor="#d4d4d4"
        padding="8px"
        borderBottom="1px solid #ccc"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <span>Constraint {num + 1}</span>
        <Box display="flex" gap="8px">
          <Button
            onClick={handleSwitch}
            variant={enabled ? "outlined" : "contained"}
            color={enabled ? "error" : "primary"}
          >
            {enabled ? "Disable" : "Enable"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => {
              deleteCard(num);
            }}
          >
            <DeleteIcon />
          </Button>
        </Box>
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
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
        />
      </Box>
    </CardContent>
  );
}
