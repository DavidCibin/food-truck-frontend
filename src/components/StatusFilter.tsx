import React from "react";

/** ************************************************************** */
/* Types */
type StatusFilterProps = {
  allStatus: string[];
  statusFilter: string[];
  setStatusFilter: (filter: string[]) => void;
};

/** ************************************************************** */
/* StatusFilter Component */
export default function StatusFilter({
  allStatus,
  statusFilter,
  setStatusFilter,
}: StatusFilterProps): JSX.Element {
  /** ************************************************************** */
  /* Functions */
  const handleCheckboxChange = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  /** ************************************************************** */
  /* Render */
  return (
    <>
      <div className="d-block mb-2 fw-medium">Filter by Status:</div>
      {allStatus.sort().map((status) => (
        <div key={status} className="form-check mb-2">
          <input
            type="checkbox"
            id={`status-${status}`}
            className="form-check-input"
            checked={statusFilter.includes(status)}
            onChange={() => handleCheckboxChange(status)}
          />
          <label htmlFor={`status-${status}`} className="form-check-label">
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </label>
        </div>
      ))}
    </>
  );
}
