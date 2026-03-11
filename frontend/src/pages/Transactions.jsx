import { useEffect, useState, useCallback } from 'react'
import { transactionsApi } from '../services/api'
import { moneyFormatter } from '../services/helpers'
import { PiReceipt } from 'react-icons/pi'
import Loader from '../components/Loader'
import NavBar from '../components/NavBar'

const filters = [
  { id: 'all', label: 'All', type: null },
  { id: 'revenue', label: 'Revenue', type: 'revenue' },
  { id: 'expenses', label: 'Expenses', type: 'expense' },
]

const defaultLimit = 10

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [skip, setSkip] = useState(0)

  const typeParam = filters.find((f) => f.id === filter)?.type ?? null

  const fetchTransactions = useCallback((skipCount = 0, append = false) => {
    const params = { limit: defaultLimit, skip: skipCount }
    if (typeParam) params.type = typeParam
    transactionsApi
      .getAll(undefined, params)
      .then((res) => {
        const list = res.data.transactions ?? []
        if (!append) {
          setTransactions(list)
          setSkip(list.length)
        } else {
          setTransactions((prev) => [...prev, ...list])
          setSkip((prev) => prev + list.length)
        }
        setTotal(res.data.total ?? 0)
      })
      .catch((err) => setError(err.response?.data?.message ?? err.message))
      .finally(() => {
        setLoading(false)
        setLoadingMore(false)
      })
  }, [typeParam])

  useEffect(() => {
    fetchTransactions(0, false)
  }, [fetchTransactions])

  function handleFilterChange(id) {
    setFilter(id)
  }

  function handleLoadMore() {
    setLoadingMore(true)
    fetchTransactions(skip, true)
  }

  const hasMore = transactions.length < total

  return (
    <div className="transactions">
      <NavBar />
      <div className="transactions-title">
        <h2>Recent Transaction</h2>
      </div>
      <div className="transactions-tabs">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`transactions-tab ${filter === f.id ? 'transactions-tab--active' : ''}`}
            onClick={() => handleFilterChange(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="transactions-card">
        <div className="transactions-table-wrap">
          {loading ? (
            <div className="loader">
              <Loader />
            </div>
          ) : error ? (
            <p className="transactions-error" role="alert">{error}</p>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Items</th>
                  <th>Shop Name</th>
                  <th>Date</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="transactions-empty">
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td>
                        <span className="transactions-item">
                          <PiReceipt className="transactions-item-icon" aria-hidden />
                          {tx.itemDescription}
                        </span>
                      </td>
                      <td>{tx.shopName}</td>
                      <td>{formatDate(tx.date)}</td>
                      <td>{tx.paymentMethod}</td>
                      <td className="transactions-amount">
                        {moneyFormatter(tx.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        {hasMore && !loading && !error && (
          <div className="transactions-load-more">
            <button
              type="button"
              className="transactions-load-more-btn"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading…' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions
