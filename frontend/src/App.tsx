import React from "react";
import { AppBar, Container } from "@mui/material";
import MonacoEditor from "@monaco-editor/react";
import AppToolbar from "./components/toolbar";
import { useState } from "react";
import { Box, Card, CardContent } from "@mui/material";
import { NumberSize, Resizable } from "re-resizable";

function AppContent() {
  const [leftWidth, setLeftWidth] = useState(300); // Initial width of the left pane
  const [sectionHeights, setSectionHeights] = useState([100, 100, 100]); // Initial heights of the right sections

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
    newHeights[index + 1] -= d.height;
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
        <Box overflow="auto" height="100%">
          {[...Array(10)].map((_, index) => (
            <Card key={index} style={{ margin: "8px" }}>
              <CardContent>Card {index + 1}</CardContent>
            </Card>
          ))}
        </Box>
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
              <Box
                height="40px"
                bgcolor="#f5f5f5"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderBottom="1px solid #ccc"
              >
                Section {index + 1} Bar
              </Box>
              <Box flex={1} />
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
        }}
      >
        <AppContent />
      </Container>
    </div>
  );
}

export default App;
