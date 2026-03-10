import { useEffect, useState } from 'react'
import { balancesApi } from '../services/api'
import NavBar from '../components/NavBar'
import { FaAngleRight } from "react-icons/fa6";

function Balances() {
  const [balances, setBalances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    balancesApi
      .getAll()
      .then((response) => {
        console.log(response.data.balances)
        setBalances(response.data.balances ?? [])
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="balances">
      <NavBar />
      {loading && <p>Loading…</p>}
      {error ?
        <p className="balances-error">{error}</p>
        :
        !loading && balances.length === 0 ?
          <p>You have no balances</p>
          :
          (!loading && !error && balances.length > 0) ?
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
                      <button type="button" className="balances-item-remove">
                        Remove
                      </button>
                      <button type="button" className="balances-item-details">
                        Details <FaAngleRight />
                      </button>
                    </div>
                  </li>

                ))}
              </ul>
            </> : <p>You have no balances</p>}
    </div>
  )
}

export default Balances
