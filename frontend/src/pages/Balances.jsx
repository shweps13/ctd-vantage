import { useEffect, useState } from 'react'
import { balancesApi } from '../services/api'
import NavBar from '../components/NavBar'

function Balances() {
  const [balances, setBalances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    balancesApi
      .getAll()
      .then((response) => {
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
    <>
      <NavBar />
      <div className="balances">
        {loading && <p>Loading…</p>}
        {error ?
          <p className="balances-error">{error}</p>
          :
          !loading && balances.length === 0 ?
            <p>You have no balances</p>
            :
            (!loading && !error && balances.length > 0) ?
              <ul className="balances-list">
                {balances.map((item) => (
                  <li key={item._id ?? item.id} className="balances-item">
                    <strong>{item.bankName}</strong> — {item.accountType}: {item.balance ?? 0}
                    {item.branchName && ` (${item.branchName})`}
                  </li>
                ))}
              </ul> : <p>You have no balances</p>}
      </div>
    </>
  )
}

export default Balances
