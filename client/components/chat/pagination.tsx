interface PaginationProps {
  usersTotal: number;
  usersPage: number;
  loadUsers: (page: number) => void;
}

export const Pagination = ({
  usersTotal,
  usersPage,
  loadUsers,
}: PaginationProps) => {
  if (usersTotal <= 0) return null;

  const totalPages = Math.ceil(usersTotal / 20);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4 gap-2">
      {/* Previous */}
      <button
        disabled={usersPage === 1}
        onClick={() => loadUsers(usersPage - 1)}
        className="px-3 py-1 border rounded cursor-pointer disabled:opacity-40 disabled:cursor-default"
      >
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((pg) => (
        <button
          key={pg}
          onClick={() => loadUsers(pg)}
          className={`px-3 py-1 border rounded cursor-pointer ${
            pg === usersPage ? "bg-accent text-white" : ""
          }`}
        >
          {pg}
        </button>
      ))}

      {/* Next */}
      <button
        disabled={usersPage === totalPages}
        onClick={() => loadUsers(usersPage + 1)}
        className="px-3 py-1 border rounded cursor-pointer disabled:opacity-40 disabled:cursor-default"
      >
        Next
      </button>
    </div>
  );
};
