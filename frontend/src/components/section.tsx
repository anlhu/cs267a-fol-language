import { Button, Chip } from "@mui/material";
import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";
import { Box } from "@mui/material";
import { useConstants, usePredicates, useFunctions } from "./context";

type ChipListProps = {
  items: { name: string }[];
  onDelete: (index: number) => void;
  onClick: (index: number) => void;
  onRightClick?: (index: number, event: React.MouseEvent) => void;
  isAdding: boolean;
  onAddClick: () => void;
  addInputValue: string;
  setAddInputValue: (val: string) => void;
  onAddConfirm: () => void;
  onAddCancel: () => void;
  addPlaceholder: string;
  editableIndex?: number | null;
  editInputValue?: string;
  setEditInputValue?: (val: string) => void;
  onEditConfirm?: () => void;
  onEditCancel?: () => void;
  selectedIndex?: number | null;
};

function ChipList({
  items,
  onDelete,
  onClick,
  onRightClick,
  isAdding,
  onAddClick,
  addInputValue,
  setAddInputValue,
  onAddConfirm,
  onAddCancel,
  addPlaceholder,
  editableIndex,
  editInputValue,
  setEditInputValue,
  onEditConfirm,
  onEditCancel,
  selectedIndex,
}: ChipListProps) {
  return (
    <>
      {items.map((item, index) => (
        <span
          key={index}
          onContextMenu={
            onRightClick
              ? (e) => {
                  e.preventDefault();
                  onRightClick(index, e);
                }
              : undefined
          }
          style={{ display: "inline-flex" }}
        >
          {editableIndex === index ? (
            <Box display="flex" alignItems="center" gap="8px">
              <input
                type="text"
                value={editInputValue}
                onChange={(e) => setEditInputValue?.(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") onEditConfirm?.();
                  if (e.key === "Escape") onEditCancel?.();
                }}
                style={{
                  padding: "4px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <Button variant="contained" size="small" onClick={onEditConfirm}>
                Save
              </Button>
              <Button variant="outlined" size="small" onClick={onEditCancel}>
                Cancel
              </Button>
            </Box>
          ) : (
            <Chip
              label={item.name}
              onDelete={() => onDelete(index)}
              clickable={!!onClick}
              onClick={() => onClick(index)}
              sx={
                selectedIndex === index
                  ? {
                      bgcolor: "#888",
                      color: "#fff",
                    }
                  : undefined
              }
            />
          )}
        </span>
      ))}
      {isAdding ? (
        <Box display="flex" alignItems="center" gap="8px">
          <input
            type="text"
            value={addInputValue}
            onChange={(e) => setAddInputValue(e.target.value)}
            placeholder={addPlaceholder}
            style={{
              padding: "4px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <Button variant="contained" size="small" onClick={onAddConfirm}>
            Add
          </Button>
          <Button variant="outlined" size="small" onClick={onAddCancel}>
            Cancel
          </Button>
        </Box>
      ) : (
        <Chip label="+" onClick={onAddClick} />
      )}
    </>
  );
}

type SectionConfig = {
  label: string;
  useData: () => {
    data: any[];
    setData: (data: any[]) => void;
  };
  addPlaceholder: string;
  getNewItem: (name: string) => any;
  showEditor?: boolean;
  showTable?: boolean;
  tableContent?: React.ReactNode;
};

const sectionConfigs: SectionConfig[] = [
  // Constants config
  {
    label: "Constants",
    useData: () => {
      const { constants, setConstants } = useConstants();
      return { data: constants, setData: setConstants };
    },
    addPlaceholder: "Enter constant",
    getNewItem: (name: string) => ({ id: Date.now(), name }),
  },
  // Predicates config
  {
    label: "Predicates",
    useData: () => {
      const { predicates, setPredicates } = usePredicates();
      return { data: predicates, setData: setPredicates };
    },
    addPlaceholder: "Enter predicate",
    getNewItem: (name: string) => ({ name, data: {}, negated: false }),
    showTable: true,
    tableContent: (
      <>
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
      </>
    ),
  },
  // Functions config
  {
    label: "Functions",
    useData: () => {
      const { functions, setFunctions } = useFunctions();
      return { data: functions, setData: setFunctions };
    },
    addPlaceholder: "Enter function",
    getNewItem: (name: string) => ({ name, data: `// Code for ${name}` }),
    showEditor: true,
  },
];

export function Section({ idx, width }: { idx: number; width: number }) {
  const config = sectionConfigs[idx];
  const { data, setData } = config.useData();

  const [isAdding, setIsAdding] = useState(false);
  const [addInputValue, setAddInputValue] = useState("");
  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [editInputValue, setEditInputValue] = useState("");

  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

  const selectedItem = data[selectedIndex ?? -1];

  const handleChipClick = (index: number) => {
    setSelectedIndex(index);
    // other stuff
  };

  const handleDelete = (index: number) => {
    setData(data.filter((_: any, i: number) => i !== index));
    if (editableIndex === index) setEditableIndex(null);
  };

  const handleAddClick = () => setIsAdding(true);

  const handleAddConfirm = () => {
    if (addInputValue.trim() !== "") {
      setData([...data, config.getNewItem(addInputValue.trim())]);
      setAddInputValue("");
      setIsAdding(false);
      setSelectedIndex(data.length);
    }
  };

  const handleAddCancel = () => {
    setAddInputValue("");
    setIsAdding(false);
  };

  const handleChipRClick = (index: number) => {
    setEditableIndex(index);
    setEditInputValue(data[index].name);
  };

  const handleEditConfirm = () => {
    if (editableIndex !== null && editInputValue.trim() !== "") {
      setData(
        data.map((item: any, i: number) =>
          i === editableIndex ? { ...item, name: editInputValue.trim() } : item
        )
      );
      setEditableIndex(null);
      setEditInputValue("");
    }
  };

  const handleEditCancel = () => {
    setEditableIndex(null);
    setEditInputValue("");
  };

  const handleEditorChange = (value: string | undefined) => {
    const newData = data.map((f) =>
      f.name === selectedItem.name ? { ...f, data: value ?? "" } : f
    );
    setData(newData);
  };

  return (
    <Box borderTop="2px solid #888">
      <Box
        height="40px"
        bgcolor="#d4d4d4"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {config.label}
      </Box>
      <Box
        maxWidth={width}
        height="40px"
        overflow="auto"
        padding="8px"
        display="flex"
        gap="8px"
        alignContent="flex-start"
        flexWrap="wrap"
      >
        <ChipList
          items={data}
          onDelete={handleDelete}
          onClick={handleChipClick}
          onRightClick={handleChipRClick}
          isAdding={isAdding}
          onAddClick={handleAddClick}
          addInputValue={addInputValue}
          setAddInputValue={setAddInputValue}
          onAddConfirm={handleAddConfirm}
          onAddCancel={handleAddCancel}
          addPlaceholder={config.addPlaceholder}
          editableIndex={editableIndex}
          editInputValue={editInputValue}
          setEditInputValue={setEditInputValue}
          onEditConfirm={handleEditConfirm}
          onEditCancel={handleEditCancel}
          selectedIndex={selectedIndex}
        />
      </Box>
      {config.showTable && (
        <Box
          maxWidth={width}
          flex={1}
          overflow="auto"
          padding="8px"
          borderTop="1px solid #ccc"
        >
          {config.tableContent}
        </Box>
      )}
      {config.showEditor && data.length ? (
        <Box
          maxWidth={width}
          flex={1}
          overflow="auto"
          padding="8px"
          borderTop="1px solid #ccc"
        >
          <MonacoEditor
            height="200px"
            width="90%"
            defaultLanguage="javascript"
            value={selectedItem?.data}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
            theme="vs-dark"
          />
        </Box>
      ) : (
        <>Add a function</>
      )}
    </Box>
  );
}
