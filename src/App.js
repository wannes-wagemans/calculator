import { useReducer } from "react"
import "./styles.css"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentResult: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentResult === "0") return state
      if (payload.digit === "." && state.currentResult == null) {
        return state
      }
      if (payload.digit === "." && state.currentResult.includes("."))
        return state
      return {
        ...state,
        currentResult: `${state.currentResult || ""}${payload.digit}`,
      }
    case ACTIONS.CLEAR:
      return {
        ...state,
        currentOperand: "0",
        previousOperand: null,
        operation: null,
      }
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.previousResult == null ||
        state.currentResult == null
      )
        return state
      return {
        ...state,
        previousResult: null,
        overwrite: true,
        operation: null,
        currentResult: evaluate(state),
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentResult == null && state.previousResult == null)
        return state
      if (state.currentResult == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      if (state.previousResult == null) {
        return {
          ...state,
          operation: payload.operation,
          previousResult: state.currentResult,
          currentResult: null,
        }
      }
      return {
        ...state,
        previousResult: evaluate(state),
        operation: payload.operation,
        currentResult: null,
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentResult: null,
          overwrite: false,
        }
      }
      if (state.currentResult == null) return state
      if (state.currentResult.length == 1) {
        return {
          ...state,
          currentResult: null,
        }
      }

      return {
        ...state,
        currentResult: state.currentResult.slice(0, -1),
      }
    default:
      return state
  }
}

function evaluate({ currentResult, previousResult, operation }) {
  const previous = parseFloat(previousResult)
  const current = parseFloat(currentResult)
  if (isNaN(previous) || isNaN(current)) return ""

  let result = ""
  switch (operation) {
    case "+":
      result = previous + current
      break
    case "-":
      result = previous - current
      break
    case "*":
      result = previous * current
      break
    case "÷":
      result = previous / current
      break
  }
  return result.toString()
}

const INT_FORMAT = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatResult(res) {
  if (res == null) return

  const [int, decimal] = res.split(".")
  if (decimal == null) return INT_FORMAT.format(int)
  return `${INT_FORMAT.format(int)}.${decimal}`
}

function App() {
  const [{ currentResult, previousResult, operation }, dispatch] = useReducer(
    reducer,
    {}
  )

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-result">
          {formatResult(previousResult)} {operation}
        </div>
        <div className="current-result">{formatResult(currentResult)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  )
}

export default App
