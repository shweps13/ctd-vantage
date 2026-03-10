import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { balancesApi } from '../services/api'
import { FaAngleRight, FaPlus } from 'react-icons/fa6'

import NavBar from '../components/NavBar'
import AddBalance from '../components/modals/AddBalance'
import RemoveBalance from '../components/modals/RemoveBalance'
import Loader from '../components/Loader'

function Balances() {
  const [balances, setBalances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState(null)

  function fetchBalances() {
    balancesApi
      .getAll()
      .then((res) => setBalances(res.data.balances ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBalances()
  }, [])

  return (
    <div className="balances">
      <NavBar />
      {loading &&
        <div className="loader">
          <Loader />
        </div>
      }
      {error ? (
        <p className="balances-error">{error}</p>
      ) : !loading && balances.length === 0 ? (
        <div className="balances-item">
          <button type="button" className="balances-item-add" onClick={() => setAddOpen(true)}>
            <FaPlus /> Add Account
          </button>
        </div>
      ) : !loading && !error && balances.length > 0 ? (
        <>
          <div className="balances-header">
            <h2>Balances</h2>
          </div>
          <ul className="balances-list">
            {balances.map((item) => (
              <li key={item._id} className="balances-item">
                <div className="balances-item-header">
                  <div>{item.accountType}</div>
                  <div>{item.bankName}</div>
                </div>
                <div className="balances-item-number">
                  <span>{item.accountNumber}</span>
                  <div>Account Number</div>
                </div>
                <div className="balances-item-amount">
                  <span>${item.balance?.toLocaleString?.() ?? 0}</span>
                  <div>Total amount</div>
                </div>
                <div className="balances-item-footer">
                  <button
                    type="button"
                    className="balances-item-remove"
                    onClick={() => setRemoveTarget(item)}
                  >
                    Remove
                  </button>
                  <Link
                    to={`/balances/${item._id}`}
                    className="balances-item-details"
                  >
                    Details <FaAngleRight />
                  </Link>
                </div>
              </li>
            ))}
            <div className="balances-item">
              <button type="button" className="balances-item-add" onClick={() => setAddOpen(true)}>
                <FaPlus /> Add Account
              </button>
            </div>
          </ul>
        </>
      ) : (
        <ul className="balances-list">
          <li className="balances-item">
            <button type="button" className="balances-item-add" onClick={() => setAddOpen(true)}>
              <FaPlus /> Add Account
            </button>
          </li>
        </ul>
      )}

      <AddBalance
        key={addOpen ? 'open' : 'closed'}
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={fetchBalances}
      />
      <RemoveBalance
        key={removeTarget?._id ?? 'closed'}
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        balance={removeTarget}
        onConfirm={fetchBalances}
      />
    </div>
  )
}

export default Balances
