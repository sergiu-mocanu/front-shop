import type { ReactNode } from 'react'

export type Column<T> = {
  header: string
  /** What the cell shows for one row. */
  cell: (row: T) => ReactNode
  /** Optional class on the cells of this column (e.g. 'is-numeric' to right-align). */
  className?: string
}

type DataTableProps<T> = {
  /** Describes the table for screen readers (visually hidden). */
  caption: string
  columns: Column<T>[]
  rows: T[]
  /** A stable, unique key per row (React's list key). */
  rowKey: (row: T) => string
  /** Shown instead of the table when there is no row. */
  empty: string
}

// A generic table: the columns are configuration, so the same component lists products today and
// orders on the next page ("written twice = a component"). T is the row type, inferred from rows.
function DataTable<T>({ caption, columns, rows, rowKey, empty }: DataTableProps<T>) {
  if (rows.length === 0) {
    return <p className="fetch-message">{empty}</p>
  }

  return (
    // The wrapper scrolls sideways on narrow screens, so the page itself never does.
    <div className="data-table-wrap">
      <table className="data-table">
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header} scope="col" className={column.className}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.header} className={column.className}>{column.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
