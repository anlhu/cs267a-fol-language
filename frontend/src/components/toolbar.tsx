import { Toolbar, Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

function AppToolbar({}) {
  return (
    <Toolbar style={{ justifyContent: "center" }}>
      <Button color="inherit" variant="outlined">
        Run <PlayArrowIcon />
      </Button>
    </Toolbar>
  );
}

export default AppToolbar;
