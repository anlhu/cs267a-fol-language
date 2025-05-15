import React, { createContext, useContext } from "react";

type Constraint = {
  code: string;
  enabled: boolean;
};
type ConstraintsContextType = {
  constraints: Constraint[];
  setConstraints: React.Dispatch<React.SetStateAction<Constraint[]>>;
};
type ConstantsContextType = {
  constants: string[];
  setConstants: React.Dispatch<React.SetStateAction<string[]>>;
};
type PredicatesContextType = {
  predicates: string[];
  setPredicates: React.Dispatch<React.SetStateAction<string[]>>;
};
type FunctionsContextType = {
  functions: string[];
  setFunctions: React.Dispatch<React.SetStateAction<string[]>>;
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
  const [constants, setConstants] = React.useState<string[]>(["Constant 1"]);
  const [predicates, setPredicates] = React.useState<string[]>(["Predicate 1"]);
  const [functions, setFunctions] = React.useState<string[]>(["Function 1"]);

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
