import React, { createContext, useContext } from "react";

type Evaluation = {
  predicate: string;
  args: string[];
  value: boolean;
};

type Constraint = {
  code: string;
  enabled: boolean;
  satisfied?: boolean;
  error?: string;
  evaluations?: Evaluation[];
};

type Constant = {
  id: number;
  name: string;
};
type Predicate = {
  name: string;
  data: {
    paramCount: number;
    truthTable: Record<string, boolean>;
  };
  negated: boolean;
};
type Function = {
  name: string;
  data: string;
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
  const [constants, setConstants] = React.useState<Constant[]>([
    { id: 1, name: "Zeus" },
    { id: 2, name: "Hera" },
    { id: 3, name: "Apollo" },
    { id: 4, name: "Athena" },
  ]);

  const [predicates, setPredicates] = React.useState<Predicate[]>([
    {
      name: "God",
      data: {
        paramCount: 1,
        truthTable: {
          Zeus: true,
          Hera: true,
          Apollo: true,
          Athena: true,
        },
      },
      negated: false,
    },
    {
      name: "Human",
      data: {
        paramCount: 1,
        truthTable: {
          Zeus: false,
          Hera: false,
          Apollo: false,
          Athena: false,
        },
      },
      negated: false,
    },
    {
      name: "Parent",
      data: {
        paramCount: 2,
        truthTable: {
          "Zeus,Apollo": true,
          "Hera,Apollo": true,
          "Zeus,Athena": true,
        },
      },
      negated: false,
    },
  ]);

  const [functions, setFunctions] = React.useState<Function[]>([
    {
      name: "spouse",
      data: 'def spouse(x):\n    if x == "Zeus":\n        return "Hera"\n    elif x == "Hera":\n        return "Zeus"\n    else:\n        return None',
    },
  ]);

  const [constraints, setConstraints] = React.useState<Constraint[]>([
    {
      // True: Zeus is a god
      code: "God(Zeus)",
      enabled: true,
    },
    {
      // False: Apollo is a parent of Zeus (reverse of actual relationship)
      code: "Parent(Apollo, Zeus)",
      enabled: true,
    },
    {
      // False: Hera is human (contradicts our truth table)
      code: "Human(Hera)",
      enabled: true,
    },
    {
      // False: Zeus's spouse (Hera) is human
      code: "Human(spouse(Zeus))",
      enabled: true,
    },
    {
      // False: All gods are human (direct contradiction)
      code: "forall(x) God(x) -> Human(x)",
      enabled: true,
    },
  ]);

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
