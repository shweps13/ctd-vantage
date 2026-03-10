import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { balancesApi } from '../services/api'
import NavBar from '../components/NavBar'
import AddBalance from '../components/modals/AddBalance'
import RemoveBalance from '../components/modals/RemoveBalance'
import { FaAngleLeft } from 'react-icons/fa6'

function formatDate(date) {
  if (!date) return '—'
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function BalanceDetails() {
  const { balanceId } = useParams()
  const navigate = useNavigate()
  const [balanceInfo, setBalanceInfo] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const fetchDetails = useCallback((skip = 0, append = false) => {
    const limit = 10
    balancesApi
      .getDetails(balanceId, undefined, { limit, skip })
      .then((res) => {
        const { balanceInfo: info, transactions: txs } = res.data
        if (!append) {
          setBalanceInfo(info ?? null)
          setTransactions(txs ?? [])
        } else {
          setTransactions((prev) => [...prev, ...(txs ?? [])])
        }
        setTotal(res.data.total ?? 0)
      })
      .catch((err) => setError(err.response?.data?.message ?? err.message))
      .finally(() => {
        setLoading(false)
        setLoadingMore(false)
      })
  }, [balanceId])

  useEffect(() => {
    if (balanceId) fetchDetails(0, false)
  }, [balanceId, fetchDetails])

  function handleLoadMore() {
    setLoadingMore(true)
    fetchDetails(transactions.length, true)
  }

  function handleRemoveConfirm() {
    setRemoveOpen(false)
    navigate('/balances')
  }

  if (loading && !balanceInfo) {
    return (
      <div className="balance-details">
        <NavBar />
        <p>Loading…</p>
      </div>
    )
  }

  if (error && !balanceInfo) {
    return (
      <div className="balance-details">
        <NavBar />
        <p className="balance-details-error">{error}</p>
        <Link to="/balances">Back to Balances</Link>
      </div>
    )
  }

  if (!balanceInfo) {
    return (
      <div className="balance-details">
        <NavBar />
        <p>Account not found.</p>
        <Link to="/balances">Back to Balances</Link>
      </div>
    )
  }

  const hasMore = transactions.length < total

  return (
    <div className="balance-details">
      <NavBar />
      <div className="balance-details-back">
        <Link to="/balances" className="balance-details-back-link">
          <FaAngleLeft /> Back to Balances
        </Link>
      </div>

      <section className="balance-details-card">
        <h2 className="balance-details-card-title">Account Details</h2>
        <dl className="balance-details-dl">
          <div className="balance-details-row">
            <dt>Bank Name</dt>
            <dd>{balanceInfo.bankName}</dd>
          </div>
          <div className="balance-details-row">
            <dt>Account Type</dt>
            <dd>{balanceInfo.accountType}</dd>
          </div>
          <div className="balance-details-row">
            <dt>Branch Name</dt>
            <dd>{balanceInfo.branchName || '—'}</dd>
          </div>
          <div className="balance-details-row">
            <dt>Account Number</dt>
            <dd>{balanceInfo.accountNumber}</dd>
          </div>
          <div className="balance-details-row">
            <dt>Balance</dt>
            <dd className="balance-details-amount">
              ${Number(balanceInfo.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </dd>
          </div>
        </dl>
        <div className="balance-details-actions">
          <button
            type="button"
            className="balance-details-edit"
            onClick={() => setEditOpen(true)}
          >
            Edit Details
          </button>
          <button
            type="button"
            className="balance-details-remove-link"
            onClick={() => setRemoveOpen(true)}
          >
            Remove
          </button>
        </div>
      </section>

      <section className="balance-details-card">
        <h2 className="balance-details-card-title">Transactions History</h2>
        <div className="balance-details-table-wrap">
          <table className="balance-details-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="balance-details-empty">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{formatDate(tx.date)}</td>
                    <td>{tx.transactionType === 'revenue' ? 'Credit' : 'Debit'}</td>
                    <td>{tx.itemDescription || tx.shopName || '—'}</td>
                    <td className="balance-details-tx-amount">
                      ${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className="balance-details-load-more">
            <button
              type="button"
              className="balance-details-load"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading…' : 'Load More'}
            </button>
          </div>
        )}
      </section>

      <AddBalance
        key={editOpen ? balanceInfo._id : 'closed'}
        open={editOpen}
        onOpenChange={setEditOpen}
        balance={balanceInfo}
        onSuccess={() => fetchDetails(0, false)}
      />
      <RemoveBalance
        key={removeOpen ? balanceInfo._id : 'closed'}
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        balance={balanceInfo}
        onConfirm={handleRemoveConfirm}
      />
    </div>
  )
}

export default BalanceDetails
