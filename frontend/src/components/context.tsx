import React, { createContext, useContext } from "react";

type Constraint = {
  code: string;
  enabled: boolean;
};
type Constant = {
  id: number;
  name: string;
};
type Predicate = {
  name: string;
  selected: Object;
  negated: boolean;
};
type Function = {
  name: string;
  code: string;
};
type ConstraintsContextType = {
  constraints: Constraint[];
  setConstraints: React.Dispatch<React.SetStateAction<Constraint[]>>;
};
type ConstantsContextType = {
  constants: Constant[];
  setConstants: React.Dispatch<React.SetStateAction<Constant[]>>;
};
type PredicatesContextType = {
  predicates: Predicate[];
  setPredicates: React.Dispatch<React.SetStateAction<Predicate[]>>;
};
type FunctionsContextType = {
  functions: Function[];
  setFunctions: React.Dispatch<React.SetStateAction<Function[]>>;
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

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [constraints, setConstraints] = React.useState<Constraint[]>([
    { code: "// Code for Card 1", enabled: true },
  ]);
  const [constants, setConstants] = React.useState<Constant[]>([{id: 0, name: "Constant 1"}]);
  const [predicates, setPredicates] = React.useState<Predicate[]>([{name: "Predicate 1", selected: {}, negated: false}]);
  const [functions, setFunctions] = React.useState<Function[]>([{name: "Function 1", code: "// Code for Function 1"}]);

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
