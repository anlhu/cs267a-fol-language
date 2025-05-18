import { Button, Chip } from "@mui/material";
import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";
import { Box } from "@mui/material";
import { useConstants, usePredicates, useFunctions } from "./context";

type ChipListProps = {
  items: { name: string }[];
  onDelete: (index: number) => void;
  onClick?: (index: number) => void;
  onRightClick?: (index: number, event: React.MouseEvent) => void;
  isAdding: boolean;
  onAddClick: () => void;
  addInputValue: string;
  setAddInputValue: (val: string) => void;
  onAddConfirm: () => void;
  onAddCancel: () => void;
  addPlaceholder: string;
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
}: ChipListProps & {
  editableIndex?: number | null;
  editInputValue?: string;
  setEditInputValue?: (val: string) => void;
  onEditConfirm?: () => void;
  onEditCancel?: () => void;
}) {
  return (
    <>
      {items.map((item, index) => (
        <span
          key={index}
          onContextMenu={onRightClick ? (e) => { e.preventDefault(); onRightClick(index, e); } : undefined}
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
              onClick={onClick ? () => onClick(index) : undefined}
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

function ConstantsSection() {
  const { constants, setConstants } = useConstants();
  const [isAdding, setIsAdding] = useState(false);
  const [newConstant, setNewConstant] = useState("");
  const [newConstantId, setNewConstantId] = useState(1);

  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [editInputValue, setEditInputValue] = useState("");

  const handleDelete = (index: number) => {
    setConstants(constants.filter((_, i) => i !== index));
    if (editableIndex === index) setEditableIndex(null);
  };

  const handleAddClick = () => setIsAdding(true);

  const handleAddConfirm = () => {
    if (newConstant.trim() !== "") {
      setConstants([...constants, { id: newConstantId, name: newConstant.trim() }]);
      setNewConstant("");
      setNewConstantId(newConstantId + 1);
      setIsAdding(false);
    }
  };

  const handleAddCancel = () => {
    setNewConstant("");
    setIsAdding(false);
  };

  const handleChipClick = (index: number) => {
    // alert(`Clicked constant: ${constants[index].name}`);
  };

  const handleChipRClick = (index: number) => {
    setEditableIndex(index);
    setEditInputValue(constants[index].name);
  };

  const handleEditConfirm = () => {
    if (editableIndex !== null && editInputValue.trim() !== "") {
      setConstants(constants.map((c, i) =>
        i === editableIndex ? { ...c, name: editInputValue.trim() } : c
      ));
      setEditableIndex(null);
      setEditInputValue("");
    }
  };

  const handleEditCancel = () => {
    setEditableIndex(null);
    setEditInputValue("");
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
        <ChipList
          items={constants}
          onDelete={handleDelete}
          onClick={handleChipClick}
          isAdding={isAdding}
          onAddClick={handleAddClick}
          onRightClick={handleChipRClick}
          addInputValue={newConstant}
          setAddInputValue={setNewConstant}
          onAddConfirm={handleAddConfirm}
          onAddCancel={handleAddCancel}
          addPlaceholder="Enter constant"
          editableIndex={editableIndex}
          editInputValue={editInputValue}
          setEditInputValue={setEditInputValue}
          onEditConfirm={handleEditConfirm}
          onEditCancel={handleEditCancel}
        />
      </Box>
    </>
  );
}

function PredicateSection({ width }: { width: number }) {
  const { predicates, setPredicates } = usePredicates();
  const [isAdding, setIsAdding] = useState(false);
  const [newPredicate, setNewPredicate] = useState("");

  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [editInputValue, setEditInputValue] = useState("");

  const handleDelete = (index: number) => {
    setPredicates(predicates.filter((_, i) => i !== index));
    if (editableIndex === index) setEditableIndex(null);
  };

  const handleAddClick = () => setIsAdding(true);

  const handleAddConfirm = () => {
    if (newPredicate.trim() !== "") {
      setPredicates([
        ...predicates,
        { name: newPredicate.trim(), selected: {}, negated: false },
      ]);
      setNewPredicate("");
      setIsAdding(false);
    }
  };

  const handleAddCancel = () => {
    setNewPredicate("");
    setIsAdding(false);
  };

  const handleChipClick = (index: number) => {
    alert(`Clicked predicate: ${predicates[index].name}`);
  };

  const handleChipRClick = (index: number) => {
    setEditableIndex(index);
    setEditInputValue(predicates[index].name);
  };

  const handleEditConfirm = () => {
    if (editableIndex !== null && editInputValue.trim() !== "") {
      setPredicates(predicates.map((p, i) =>
        i === editableIndex ? { ...p, name: editInputValue.trim() } : p
      ));
      setEditableIndex(null);
      setEditInputValue("");
    }
  };

  const handleEditCancel = () => {
    setEditableIndex(null);
    setEditInputValue("");
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
        <ChipList
          items={predicates}
          onDelete={handleDelete}
          onClick={handleChipClick}
          onRightClick={handleChipRClick}
          isAdding={isAdding}
          onAddClick={handleAddClick}
          addInputValue={newPredicate}
          setAddInputValue={setNewPredicate}
          onAddConfirm={handleAddConfirm}
          onAddCancel={handleAddCancel}
          addPlaceholder="Enter predicate"
          editableIndex={editableIndex}
          editInputValue={editInputValue}
          setEditInputValue={setEditInputValue}
          onEditConfirm={handleEditConfirm}
          onEditCancel={handleEditCancel}
        />
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

  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [editInputValue, setEditInputValue] = useState("");

  const handleDelete = (index: number) => {
    setFunctions(functions.filter((_, i) => i !== index));
    if (editableIndex === index) setEditableIndex(null);
  };

  const handleAddClick = () => setIsAdding(true);

  const handleAddConfirm = () => {
    if (newFunction.trim() !== "") {
      setFunctions([
        ...functions,
        { name: newFunction.trim(), code: "// Code for Function" },
      ]);
      setNewFunction("");
      setIsAdding(false);
    }
  };

  const handleAddCancel = () => {
    setNewFunction("");
    setIsAdding(false);
  };

  const handleChipClick = (index: number) => {
    alert(`Clicked function: ${functions[index].name}`);
  };

  const handleChipRClick = (index: number) => {
    setEditableIndex(index);
    setEditInputValue(functions[index].name);
  };

  const handleEditConfirm = () => {
    if (editableIndex !== null && editInputValue.trim() !== "") {
      setFunctions(functions.map((f, i) =>
        i === editableIndex ? { ...f, name: editInputValue.trim() } : f
      ));
      setEditableIndex(null);
      setEditInputValue("");
    }
  };

  const handleEditCancel = () => {
    setEditableIndex(null);
    setEditInputValue("");
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
        <ChipList
          items={functions}
          onDelete={handleDelete}
          onClick={handleChipClick}
          onRightClick={handleChipRClick}
          isAdding={isAdding}
          onAddClick={handleAddClick}
          addInputValue={newFunction}
          setAddInputValue={setNewFunction}
          onAddConfirm={handleAddConfirm}
          onAddCancel={handleAddCancel}
          addPlaceholder="Enter function"
          editableIndex={editableIndex}
          editInputValue={editInputValue}
          setEditInputValue={setEditInputValue}
          onEditConfirm={handleEditConfirm}
          onEditCancel={handleEditCancel}
        />
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
