import type { ReactNode } from "react";

/** Real table on desktop; stacked rows with per-cell labels on phones. */
export function DataTable({ caption, columns, rows }: { caption: string; columns: string[]; rows: ReactNode[][] }) {
  return (
    <table className="w-full border-collapse text-left text-sm max-md:block">
      <caption className="sr-only">{caption}</caption>
      <thead className="max-md:sr-only">
        <tr className="bg-sunken">
          {columns.map((c) => (
            <th key={c} scope="col" className="border border-border px-3 py-2 font-medium">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody className="max-md:block">
        {rows.map((cells, r) => (
          <tr key={r} className="max-md:mb-3 max-md:block max-md:border max-md:border-border">
            {cells.map((cell, c) => (
              <td
                key={c}
                data-label={columns[c]}
                // The phone label is generated content, so it is never part of the cell's text ("DatesNov 2025").
                className="border border-border px-3 py-2 align-top max-md:block max-md:border-0 max-md:border-b max-md:before:mb-0.5 max-md:before:block max-md:before:text-xs max-md:before:text-text-muted max-md:before:content-[attr(data-label)]"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
