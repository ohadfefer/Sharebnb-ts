import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  setActiveFilterCell as setActiveFilterCellAction,
  clearActiveFilterCell as clearActiveFilterCellAction,
} from "../store/reducers/filter.panel.reducer.js"
import { useAppSelector } from "../store/hooks.js"

export function useFieldControl(fieldOrder: string[], { enableOutsideClickClose = true } = {}) {
  const dispatch = useDispatch()

  const activeFilterCell = useAppSelector(
    (state) => state.filterPanelModule?.activeFilterCell ?? null
  )

  const pillElementRef = useRef<HTMLElement>(null)
  const popoverElementRef = useRef<HTMLElement>(null)

  function focusCell(cellKey: string) {
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

    if (focusable instanceof HTMLElement) focusable.focus()
  }

  function setActiveAndFocus(cellKey: string) {
    dispatch(setActiveFilterCellAction(cellKey))
    // wait for DOM/class to update, then focus
    requestAnimationFrame(() => focusCell(cellKey))
  }

  function setActiveFilterCell(cellKey: string) {
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

  function getCellProps(cellKey: string) {
    const isActive = activeFilterCell === cellKey
    return {
      className: `cell ${cellKey} ${isActive ? "active" : ""}`,
      "data-cell": cellKey,
      tabIndex: 0,
      onMouseDown: () => setActiveAndFocus(cellKey),
      onKeyDown: (e: React.KeyboardEvent) => {
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

    function handleOutsideClick(ev: MouseEvent | TouchEvent) {
      const inPill = pillElementRef.current?.contains(ev.target as Node)
      const inPopover = popoverElementRef.current?.contains(ev.target as Node)
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
