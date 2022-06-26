type Props = {
  setPage: (page: number) => void
  currentPage: number
  totalPages: number
}

const TasksPagination = ({ totalPages, currentPage, setPage }: Props) => {
  const PagesArray = [...Array(totalPages).keys()].map(key => key + 1)

  return (
    <>
      {totalPages > 1 && (
        <div className='col-span-2 flex w-full justify-center gap-2'>
          {PagesArray.map(page => {
            return (
              <div
                className={`cursor-pointer rounded-lg border border-skin-base p-4 ${
                  currentPage === page ? 'bg-brand/60' : 'bg-brand/40'
                }`}
                onClick={() => setPage(page)}
                key={page}
              >
                {page}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default TasksPagination
