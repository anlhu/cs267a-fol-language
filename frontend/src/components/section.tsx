import { Button, Chip } from "@mui/material";
import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";
import { Box } from "@mui/material";
import { useConstants, usePredicates, useFunctions } from "./context";

function ConstantsSection() {
  const { constants, setConstants } = useConstants();
  const [isAdding, setIsAdding] = useState(false);
  const [newConstant, setNewConstant] = useState("");

  const handleDelete = (index: number) => {
    setConstants(constants.filter((_, i) => i !== index));
  };

  const handleAddClick = () => setIsAdding(true);

  const handleAddConfirm = () => {
    if (newConstant.trim() !== "") {
      setConstants([...constants, newConstant.trim()]);
      setNewConstant("");
      setIsAdding(false);
    }
  };

  const handleAddCancel = () => {
    setNewConstant("");
    setIsAdding(false);
  };

  return (
    <>
      <Box
        height="40px"
        bgcolor="#d4d4d4"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        Constants
      </Box>
      <Box
        flex={1}
        overflow="auto"
        padding="8px"
        display="flex"
        flexWrap="wrap"
        gap="8px"
        alignContent="flex-start"
      >
        {constants.map((constant, index) => (
          <Chip
            key={index}
            label={constant}
            onDelete={() => handleDelete(index)}
          />
        ))}
        {isAdding ? (
          <Box display="flex" alignItems="center" gap="8px">
            <input
              type="text"
              value={newConstant}
              onChange={(e) => setNewConstant(e.target.value)}
              placeholder="Enter constant"
              style={{
                padding: "4px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Button variant="contained" size="small" onClick={handleAddConfirm}>
              Add
            </Button>
            <Button variant="outlined" size="small" onClick={handleAddCancel}>
              Cancel
            </Button>
          </Box>
        ) : (
          <Chip label="+" onClick={handleAddClick} />
        )}
      </Box>
    </>
  );
}

function PredicateSection({ width }: { width: number }) {
  const { predicates, setPredicates } = usePredicates();
  const [isAdding, setIsAdding] = useState(false);
  const [newPredicate, setNewPredicate] = useState("");

  const handleDelete = (index: number) => {
    setPredicates(predicates.filter((_, i) => i !== index));
  };

  const handleAddClick = () => setIsAdding(true);

  const handleAddConfirm = () => {
    if (newPredicate.trim() !== "") {
      setPredicates([...predicates, newPredicate.trim()]);
      setNewPredicate("");
      setIsAdding(false);
    }
  };

  const handleAddCancel = () => {
    setNewPredicate("");
    setIsAdding(false);
  };

  return (
    <>
      <Box
        height="40px"
        bgcolor="#d4d4d4"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        Predicates
      </Box>
      <Box
        maxWidth={width}
        height="40px"
        overflow="auto"
        padding="8px"
        display="flex"
        gap="8px"
        alignContent="flex-start"
      >
        {predicates.map((predicate, index) => (
          <Chip
            key={index}
            label={predicate}
            onDelete={() => handleDelete(index)}
          />
        ))}
        {isAdding ? (
          <Box display="flex" alignItems="center" gap="8px">
            <input
              type="text"
              value={newPredicate}
              onChange={(e) => setNewPredicate(e.target.value)}
              placeholder="Enter predicate"
              style={{
                padding: "4px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Button variant="contained" size="small" onClick={handleAddConfirm}>
              Add
            </Button>
            <Button variant="outlined" size="small" onClick={handleAddCancel}>
              Cancel
            </Button>
          </Box>
        ) : (
          <Chip label="+" onClick={handleAddClick} />
        )}
      </Box>
      <Box
        maxWidth={width}
        flex={1}
        overflow="auto"
        padding="8px"
        borderTop="1px solid #ccc"
      >
        <p>
          This is an additional scrollable box. You can add any content here,
          and it will scroll independently of the chips above.
        </p>
        <p>Example content line 1</p>
        <p>Example content line 2</p>
        <p>Example content line 3</p>
        <p>Example content line 4</p>
        <p>Example content line 5</p>
        <p>Example content line 6</p>
      </Box>
    </>
  );
}

function FunctionSection({ width }: { width: number }) {
  const { functions, setFunctions } = useFunctions();
  const [isAdding, setIsAdding] = useState(false);
  const [newFunction, setNewFunction] = useState("");

  const handleDelete = (index: number) => {
    setFunctions(functions.filter((_, i) => i !== index));
  };

  const handleAddClick = () => setIsAdding(true);

  const handleAddConfirm = () => {
    if (newFunction.trim() !== "") {
      setFunctions([...functions, newFunction.trim()]);
      setNewFunction("");
      setIsAdding(false);
    }
  };

  const handleAddCancel = () => {
    setNewFunction("");
    setIsAdding(false);
  };

  return (
    <>
      <Box
        height="40px"
        bgcolor="#d4d4d4"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        Functions
      </Box>
      <Box
        maxWidth={width}
        height="40px"
        overflow="auto"
        padding="8px"
        display="flex"
        gap="8px"
        alignContent="flex-start"
      >
        {functions.map((fn, index) => (
          <Chip key={index} label={fn} onDelete={() => handleDelete(index)} />
        ))}
        {isAdding ? (
          <Box display="flex" alignItems="center" gap="8px">
            <input
              type="text"
              value={newFunction}
              onChange={(e) => setNewFunction(e.target.value)}
              placeholder="Enter function"
              style={{
                padding: "4px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Button variant="contained" size="small" onClick={handleAddConfirm}>
              Add
            </Button>
            <Button variant="outlined" size="small" onClick={handleAddCancel}>
              Cancel
            </Button>
          </Box>
        ) : (
          <Chip label="+" onClick={handleAddClick} />
        )}
      </Box>
      <Box
        maxWidth={width}
        flex={1}
        overflow="auto"
        padding="8px"
        borderTop="1px solid #ccc"
      >
        <MonacoEditor
          height="500px"
          defaultLanguage="javascript"
          defaultValue={`// Add your code here`}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
          theme="vs-dark"
        />
      </Box>
    </>
  );
}

export function Section({ idx, width }: { idx: number; width: number }) {
  let Ret = (
    <>
      <Box
        height="40px"
        bgcolor="#d4d4d4"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        Section Bar
      </Box>
      <Box flex={1} overflow="auto" padding="8px">
        <p>
          This is the content box. You can add any text, components, or other
          elements here to display in this section.
        </p>
      </Box>
    </>
  );

  if (idx === 0) {
    Ret = <ConstantsSection />;
  } else if (idx === 1) {
    Ret = <PredicateSection width={width} />;
  } else if (idx === 2) {
    Ret = <FunctionSection width={width} />;
  }

  return <Box borderTop="2px solid #888">{Ret}</Box>;
}
