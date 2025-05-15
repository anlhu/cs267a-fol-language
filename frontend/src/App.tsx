import { AppBar, Button, Container, Chip } from "@mui/material";
import MonacoEditor from "@monaco-editor/react";
import { useState, useRef, createContext, useContext } from "react";
import { Box, Card, CardContent } from "@mui/material";
import { NumberSize, Resizable } from "re-resizable";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Toolbar } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import React from "react";

// --- Contexts and hooks (unchanged) ---

type Constraint = {
  code: string;
  enabled: boolean;
};
type ConstraintsContextType = {
  constraints: Constraint[];
  setConstraints: React.Dispatch<React.SetStateAction<Constraint[]>>;
};
type ConstantsContextType = {
  constants: string[];
  setConstants: React.Dispatch<React.SetStateAction<string[]>>;
};
type PredicatesContextType = {
  predicates: string[];
  setPredicates: React.Dispatch<React.SetStateAction<string[]>>;
};
type FunctionsContextType = {
  functions: string[];
  setFunctions: React.Dispatch<React.SetStateAction<string[]>>;
};

const ConstraintsContext = createContext<ConstraintsContextType | undefined>(
  undefined
);
const ConstantsContext = createContext<ConstantsContextType | undefined>(
  undefined
);
const PredicatesContext = createContext<PredicatesContextType | undefined>(
  undefined
);
const FunctionsContext = createContext<FunctionsContextType | undefined>(
  undefined
);

export const useConstraints = () => {
  const ctx = useContext(ConstraintsContext);
  if (!ctx)
    throw new Error("useConstraints must be used within ConstraintsProvider");
  return ctx;
};
export const useConstants = () => {
  const ctx = useContext(ConstantsContext);
  if (!ctx)
    throw new Error("useConstants must be used within ConstantsProvider");
  return ctx;
};
export const usePredicates = () => {
  const ctx = useContext(PredicatesContext);
  if (!ctx)
    throw new Error("usePredicates must be used within PredicatesProvider");
  return ctx;
};
export const useFunctions = () => {
  const ctx = useContext(FunctionsContext);
  if (!ctx)
    throw new Error("useFunctions must be used within FunctionsProvider");
  return ctx;
};

function AppProviders({ children }: { children: React.ReactNode }) {
  const [constraints, setConstraints] = React.useState<Constraint[]>([
    { code: "// Code for Card 1", enabled: true },
  ]);
  const [constants, setConstants] = React.useState<string[]>([
    "Constant 1",
    "Constant 2",
  ]);
  const [predicates, setPredicates] = React.useState<string[]>([
    "Predicate 1",
    "Predicate 2",
    "Predicate 3",
    "Predicate 4",
    "Predicate 5",
  ]);
  const [functions, setFunctions] = React.useState<string[]>([
    "Function 1",
    "Function 2",
    "Function 3",
    "Function 4",
    "Function 5",
  ]);

  return (
    <ConstraintsContext.Provider value={{ constraints, setConstraints }}>
      <ConstantsContext.Provider value={{ constants, setConstants }}>
        <PredicatesContext.Provider value={{ predicates, setPredicates }}>
          <FunctionsContext.Provider value={{ functions, setFunctions }}>
            {children}
          </FunctionsContext.Provider>
        </PredicatesContext.Provider>
      </ConstantsContext.Provider>
    </ConstraintsContext.Provider>
  );
}

// --- Components using context state ---

function AppToolbar() {
  return (
    <Toolbar style={{ justifyContent: "center" }}>
      <Button color="inherit" variant="outlined">
        Run <PlayArrowIcon />
      </Button>
    </Toolbar>
  );
}

function ConstraintCardContent({
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

function LeftPane() {
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

function Section({ idx, width }: { idx: number; width: number }) {
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

function AppContent() {
  const [leftWidth, setLeftWidth] = useState(window.innerWidth / 2);
  const [sectionHeights, setSectionHeights] = useState([
    100,
    window.innerHeight / 3,
    window.innerHeight / 3,
  ]);

  const handleResizeLeft = (
    e: any,
    direction: any,
    ref: any,
    d: { width: number }
  ) => {
    setLeftWidth(leftWidth + d.width);
  };

  const handleResizeSection = (
    index: number,
    e: MouseEvent | TouchEvent,
    direction: string,
    ref: HTMLElement,
    d: NumberSize
  ) => {
    const newHeights = [...sectionHeights];
    newHeights[index] += d.height;
    setSectionHeights(newHeights);
  };

  const rightWidth = window.innerWidth - leftWidth - 50;

  return (
    <Box display="flex" height="100%">
      {/* Left Pane */}
      <Resizable
        size={{ width: leftWidth, height: "100%" }}
        onResizeStop={handleResizeLeft}
        enable={{ right: true }}
        style={{ borderRight: "1px solid #ccc" }}
      >
        <LeftPane />
      </Resizable>
      {/* Right Pane */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        borderLeft="2px solid #888"
      >
        {sectionHeights.map((height, index) => (
          <Resizable
            key={index}
            size={{ width: "100%", height }}
            onResizeStop={(e, direction, ref, d) =>
              handleResizeSection(index, e, direction, ref, d)
            }
            enable={{ bottom: index < sectionHeights.length - 1 }}
            style={{
              borderBottom:
                index < sectionHeights.length - 1 ? "1px solid #ccc" : "none",
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              height="100%"
              overflow="hidden"
            >
              <Section idx={index} width={rightWidth} />
            </Box>
          </Resizable>
        ))}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <div className="App">
      <AppProviders>
        <AppBar>
          <AppToolbar />
        </AppBar>
        <Container
          style={{
            position: "relative",
            marginTop: "64px",
            maxWidth: window.innerWidth,
            height: "calc(100vh - 64px)",
            overflow: "hidden",
            paddingTop: "16px",
          }}
        >
          <AppContent />
        </Container>
      </AppProviders>
    </div>
  );
}

export default App;
