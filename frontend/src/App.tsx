import { AppBar, Button, Container, Chip } from "@mui/material";
import MonacoEditor from "@monaco-editor/react";
import AppToolbar from "./components/toolbar";
import { useState } from "react";
import { Box, Card, CardContent } from "@mui/material";
import { NumberSize, Resizable } from "re-resizable";
import AddIcon from "@mui/icons-material/Add";

function ConstraintCardContent({ num }: { num: number }) {
  return (
    <CardContent style={{ padding: "0" }}>
      {/* Title Bar */}
      <Box
        bgcolor="#d4d4d4"
        padding="8px"
        borderBottom="1px solid #ccc"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <span>Constraint {num + 1}</span>
      </Box>
      {/* Monaco Editor */}
      <Box height="200px" overflow="hidden">
        <MonacoEditor
          height="100%"
          defaultLanguage="javascript"
          defaultValue={`// Code for Card ${num + 1}`}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
          theme="vs-dark"
        />
      </Box>
    </CardContent>
  );
}

function LeftPane() {
  return (
    <Box overflow="auto" height="100%">
      {[...Array(2)].map((_, index) => (
        <Card
          key={index}
          style={{ width: "100%%", marginBottom: "16px", marginRight: "24px" }}
        >
          <ConstraintCardContent num={index} />
        </Card>
      ))}
      <Card style={{ width: "96%" }}>
        <Button fullWidth variant="contained">
          Add Constraint <AddIcon />
        </Button>
      </Card>
    </Box>
  );
}

function ConstantsSection() {
  const [constants, setConstants] = useState<string[]>([
    "Constant 1",
    "Constant 2",
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newConstant, setNewConstant] = useState("");

  const handleDelete = (index: number) => {
    setConstants(constants.filter((_, i) => i !== index));
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

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
        alignContent="flex-start" // consistent spacing between rows
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
  const [predicates, setPredicates] = useState<string[]>([
    "Predicate 1",
    "Predicate 2",
    "Predicate 3",
    "Predicate 4",
    "Predicate 5",
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPredicate, setNewPredicate] = useState("");

  const handleDelete = (index: number) => {
    setPredicates(predicates.filter((_, i) => i !== index));
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

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
        height="40px" // Set a constant height for the box with chips
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

function FunctionSection() {
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
      <Box flex={1} overflow="auto" padding="8px">
        ass
      </Box>
    </>
  );
}

function Section({ idx, width }: { idx: number; width: number }) {
  var Ret = // default content for the section
    (
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
    Ret = <FunctionSection />;
  }

  return <Box borderTop="2px solid #888">{Ret}</Box>;
}

function AppContent() {
  const [leftWidth, setLeftWidth] = useState(window.innerWidth / 2); // Initialize to half the width of the page
  const [sectionHeights, setSectionHeights] = useState([
    window.innerHeight / 3,
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

  const rightWidth = window.innerWidth - leftWidth - 50; // Adjust for the right pane width and margin

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
      <AppBar>
        <AppToolbar />
      </AppBar>
      <Container
        style={{
          position: "relative",
          marginTop: "64px", // Adjust for AppBar
          maxWidth: window.innerWidth,
          height: "calc(100vh - 64px)", // Adjust for AppBar
          overflow: "hidden",
          paddingTop: "16px",
        }}
      >
        <AppContent />
      </Container>
    </div>
  );
}

export default App;
