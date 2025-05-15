import { Button } from "@mui/material";
import { Toolbar } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export function AppToolbar() {
  return (
    <Toolbar style={{ justifyContent: "center" }}>
      <Button color="inherit" variant="outlined">
        Run <PlayArrowIcon />
      </Button>
    </Toolbar>
  );
}
