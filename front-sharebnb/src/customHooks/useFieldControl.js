import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  setActiveFilterCell as setActiveFilterCellAction,
  clearActiveFilterCell as clearActiveFilterCellAction,
} from "../store/reducers/filter.panel.reducer"

export function useFieldControl(fieldOrder, { enableOutsideClickClose = true } = {}) {
  const dispatch = useDispatch()

  const activeFilterCell = useSelector(
    (state) => state.filterPanelModule?.activeFilterCell ?? null
  )

  const pillElementRef = useRef(null)
  const popoverElementRef = useRef(null)

  function focusCell(cellKey) {
    const root = pillElementRef.current
    if (!root) return

    // find the cell by class or data attribute
    const cell =
      root.querySelector(`.cell.${cellKey}`) ||
      root.querySelector(`[data-cell="${cellKey}"]`)

    if (!cell) return

    // Prefer focusing the first interactive element inside; fallback to the cell
    const focusable =
      cell.querySelector(
        'input, textarea, select, button, [contenteditable="true"], [tabindex]:not([tabindex="-1"])'
      ) || cell

    focusable.focus()
  }

  function setActiveAndFocus(cellKey) {
    dispatch(setActiveFilterCellAction(cellKey))
    // wait for DOM/class to update, then focus
    requestAnimationFrame(() => focusCell(cellKey))
  }

  function setActiveFilterCell(cellKey) {
    setActiveAndFocus(cellKey)
  }

  function clearActiveFilterCell() {
    dispatch(clearActiveFilterCellAction())
  }

  function goToNextCell() {
    if (!activeFilterCell) return
    const currentIndex = fieldOrder.indexOf(activeFilterCell)
    if (currentIndex === -1) return
    const nextIndex = Math.min(currentIndex + 1, fieldOrder.length - 1)
    setActiveAndFocus(fieldOrder[nextIndex])
  }

  function getCellProps(cellKey) {
    const isActive = activeFilterCell === cellKey
    return {
      className: `cell ${cellKey} ${isActive ? "active" : ""}`,
      "data-cell": cellKey,
      tabIndex: 0,
      onMouseDown: () => setActiveAndFocus(cellKey),
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          goToNextCell()
        }
      },
    }
  }

  // Close when clicking outside the pill and the popover
  useEffect(() => {
    if (!enableOutsideClickClose) return

    function handleOutsideClick(ev) {
      const inPill = pillElementRef.current?.contains(ev.target)
      const inPopover = popoverElementRef.current?.contains(ev.target)
      if (!inPill && !inPopover) clearActiveFilterCell()
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [enableOutsideClickClose])

  return {
    activeFilterCell,
    setActiveFilterCell,
    clearActiveFilterCell,
    goToNextCell,
    getCellProps,
    pillElementRef,
    popoverElementRef,
  }
}
