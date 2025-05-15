import { AppBar, Container } from "@mui/material";
import { useState } from "react";
import { Box } from "@mui/material";
import { NumberSize, Resizable } from "re-resizable";
import { AppProviders } from "./components/context";
import { AppToolbar } from "./components/toolbar";
import { ConstraintList } from "./components/constraint_list";
import { Section } from "./components/section";

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
        <ConstraintList />
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
