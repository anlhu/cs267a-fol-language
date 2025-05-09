import { AppBar, Button, Container } from "@mui/material";
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
        <Card key={index} style={{ width: "96%", marginBottom: "16px" }}>
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

function Section() {
  return (
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
      <Box flex={1} display="flex" flexDirection="column">
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
              <Section />
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
          maxWidth: "100%",
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
