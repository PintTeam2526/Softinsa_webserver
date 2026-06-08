function SLLPagination({
  className,
  currentPage,
  totalPages,
  onPageChange,
  firstContent,
  previousContent,
  nextContent,
  lastContent,
  ariaLabel = 'Paginação',
}) {
  if (totalPages < 1) {
    return null
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  function goToPage(page) {
    if (page < 1 || page > totalPages || page === currentPage) {
      return
    }

    onPageChange(page)
  }

  return (
    <div className={className} aria-label={ariaLabel}>
      <button type="button" onClick={() => goToPage(1)} disabled={currentPage === 1}>
        {firstContent}
      </button>
      <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
        {previousContent}
      </button>

      {pageNumbers.map((page) => (
        <button key={page} type="button" className={page === currentPage ? 'is-active' : ''} onClick={() => goToPage(page)}>
          {page}
        </button>
      ))}

      <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
        {nextContent}
      </button>
      <button type="button" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
        {lastContent}
      </button>
    </div>
  )
}

export default SLLPagination