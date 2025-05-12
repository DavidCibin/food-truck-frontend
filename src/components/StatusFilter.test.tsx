
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest"
import "@testing-library/jest-dom";
import StatusFilter from "./StatusFilter";

describe("StatusFilter Component", () => {
  const allStatuses = ["APPROVED", "PENDING", "REJECTED"];
  const mockSetStatusFilter = vi.fn();

  test("renders without crashing", () => {
    render(
      <StatusFilter
        allStatus={[]}
        statusFilter={[]}
        setStatusFilter={mockSetStatusFilter}
      />,
    );
    expect(screen.getByText("Filter by Status:")).toBeInTheDocument();
  });

  test("renders checkboxes for each status in allStatus prop, sorted alphabetically", () => {
    render(
      <StatusFilter
        allStatus={allStatuses}
        statusFilter={[]}
        setStatusFilter={mockSetStatusFilter}
      />,
    );
    const sortedStatuses = [...allStatuses].sort();
    sortedStatuses.forEach((status) => {
      expect(
        screen.getByLabelText(status.charAt(0) + status.slice(1).toLowerCase()),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", {
          name: status.charAt(0) + status.slice(1).toLowerCase(),
        }),
      ).toBeInTheDocument();
    });
  });

  test("renders checkboxes with correct checked state based on statusFilter prop", () => {
    const filter = ["APPROVED", "REJECTED"];
    render(
      <StatusFilter
        allStatus={allStatuses}
        statusFilter={filter}
        setStatusFilter={mockSetStatusFilter}
      />,
    );
    expect(screen.getByRole("checkbox", { name: "Approved" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Pending" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Rejected" })).toBeChecked();
  });

  test("calls setStatusFilter with the new filter when a checkbox is checked", () => {
    render(
      <StatusFilter
        allStatus={allStatuses}
        statusFilter={[]}
        setStatusFilter={mockSetStatusFilter}
      />,
    );
    const approvedCheckbox = screen.getByRole("checkbox", { name: "Approved" });
    fireEvent.click(approvedCheckbox);
    expect(mockSetStatusFilter).toHaveBeenCalledWith(["APPROVED"]);
  });

  test("calls setStatusFilter with the new filter when a checkbox is unchecked", () => {
    const filter = ["APPROVED"];
    render(
      <StatusFilter
        allStatus={allStatuses}
        statusFilter={filter}
        setStatusFilter={mockSetStatusFilter}
      />,
    );
    const approvedCheckbox = screen.getByRole("checkbox", { name: "Approved" });
    fireEvent.click(approvedCheckbox);
    expect(mockSetStatusFilter).toHaveBeenCalledWith([]);
  });
});
