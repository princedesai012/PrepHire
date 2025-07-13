import * as React from "react";

// Type imports like this are removed in plain JS/JSX
// import type {
//   ToastActionElement,
//   ToastProps,
// } from "@/components/ui/toast"

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

// Type definitions are removed. The 'ToasterToast' structure
// would be implicitly understood from its usage in plain JS.
// type ToasterToast = ToastProps & {
//   id: string
//   title?: React.ReactNode
//   description?: React.ReactNode
//   action?: ToastActionElement
// }

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} // Removed `as const` as it's a TypeScript-specific assertion

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Type definitions are removed.
// type ActionType = typeof actionTypes
// type Action =
//   | {
//       type: ActionType["ADD_TOAST"]
//       toast: ToasterToast
//     }
//   | {
//       type: ActionType["UPDATE_TOAST"]
//       toast: Partial<ToasterToast>
//     }
//   | {
//       type: ActionType["DISMISS_TOAST"]
//       toastId?: ToasterToast["id"]
//     }
//   | {
//       type: ActionType["REMOVE_TOAST"]
//       toastId?: ToasterToast["id"]
//     }

// interface State {
//   toasts: ToasterToast[]
// }

const toastTimeouts = new Map(); // Removed type annotation <string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId) => { // Removed type annotation 'toastId: string'
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state, action) => { // Removed type annotations 'state: State, action: Action): State'
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners = []; // Removed type annotation Array<(state: State) => void>

let memoryState = { toasts: [] }; // Removed type annotation : State

function dispatch(action) { // Removed type annotation 'action: Action'
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Type definitions are removed.
// type Toast = Omit<ToasterToast, "id">

function toast({ ...props }) { // Removed type annotation ': Toast'
  const id = genId();

  const update = (props) => // Removed type annotation '(props: ToasterToast)'
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState(memoryState); // Removed type annotation '<State>'

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }), // Removed type annotation 'toastId?: string'
  };
}

export { useToast, toast };