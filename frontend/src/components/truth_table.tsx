import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableContainer,
} from "@mui/material";
import { useConstants, usePredicates } from "./context";
import { useEffect, useState } from "react";

export function TruthTable({
  selectedItem,
  selectedIndex,
  data,
  setData,
}: {
  selectedItem: any;
  selectedIndex: number | null;
  data: any[];
  setData: (data: any[]) => void;
}) {
  const { constants } = useConstants();

  const [paramCount, setParamCount] = useState(
    typeof selectedItem.data.paramCount === "number"
      ? selectedItem.data.paramCount
      : 1
  );
  const [filter, setFilter] = useState<"all" | "true" | "false">("all");
  const [negated, setNegated] = useState(!!selectedItem.negated);

  const [truthTable, setTruthTable] = useState<{ [key: string]: boolean }>(
    selectedItem.data.truthTable || {}
  );

  // Update predicate data when state changes
  useEffect(() => {
    setData(
      data.map((item: any, i: number) =>
        i === selectedIndex
          ? {
              ...item,
              negated,
              data: {
                ...item.data,
                paramCount,
                truthTable,
              },
            }
          : item
      )
    );
  }, [paramCount, truthTable, negated]);

  // Update table when selected item changes
  useEffect(() => {
    if (selectedIndex === null) return;
    setParamCount(
      typeof selectedItem.data.paramCount === "number"
        ? selectedItem.data.paramCount
        : 1
    );
    setNegated(!!selectedItem.negated);
    setTruthTable(selectedItem.data.truthTable || {});
  }, [selectedIndex, selectedItem, data]);

  // Generate all combinations of constants for paramCount
  function getTuples(arr: any[], k: number): any[][] {
    if (k === 0) return [[]];
    return arr.flatMap((v) => getTuples(arr, k - 1).map((t) => [v, ...t]));
  }
  const tuples = getTuples(constants, paramCount);

  const handleToggle = (key: string) => {
    setTruthTable((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleParamCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Math.max(1, Math.min(4, Number(e.target.value)));
    setParamCount(val);
    // setTruthTable({}); // dont forget mapping if we change number of params
  };

  const handleFilterChange = (e: SelectChangeEvent) => {
    setFilter(e.target.value as "all" | "true" | "false");
  };

  const handleNegationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNegated(e.target.checked);
  };

  if (!selectedItem) return <></>;

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Parameters"
          type="number"
          size="small"
          value={paramCount}
          onChange={handleParamCountChange}
          inputProps={{ min: 1, max: 4 }}
          style={{ width: 120 }}
        />
        <FormControl size="small" style={{ minWidth: 120 }}>
          <InputLabel>View</InputLabel>
          <Select value={filter} label="View" onChange={handleFilterChange}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox checked={negated} onChange={handleNegationChange} />
          }
          label="Negated"
        />
      </Box>
      <Paper variant="outlined">
        <TableContainer style={{ maxHeight: 400 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[...Array(paramCount)].map((_, i) => (
                  <TableCell key={i}>{`Arg${i + 1}`}</TableCell>
                ))}
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tuples
                .filter((tuple) => {
                  const key = tuple.map((c: any) => c.name).join(",");
                  const val = !!truthTable[key];
                  if (filter === "all") return true;
                  if (filter === "true") return val;
                  if (filter === "false") return !val;
                  return true;
                })
                .map((tuple, idx) => {
                  const key = tuple.map((c: any) => c.name).join(",");
                  let val = !!truthTable[key];
                  if (negated) val = !val;
                  return (
                    <TableRow key={key}>
                      {tuple.map((c: any, i: number) => (
                        <TableCell key={i}>{c.name}</TableCell>
                      ))}
                      <TableCell align="right">
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: 32,
                            height: 32,
                            bgcolor: val ? "#4caf50" : "#f44336",
                            color: "#fff",
                            borderRadius: "50%",
                            textAlign: "center",
                            lineHeight: "32px",
                            cursor: "pointer",
                            userSelect: "none",
                            fontWeight: "bold",
                          }}
                          onClick={() => handleToggle(key)}
                        >
                          {val ? "T" : "F"}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        {constants.length === 0 && (
          <Typography color="text.secondary" mt={2} align="center">
            Add constants to define the truth table.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
