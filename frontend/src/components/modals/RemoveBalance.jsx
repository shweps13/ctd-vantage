import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { balancesApi } from '../../services/api'

function RemoveBalance({ open, onOpenChange, balance, onConfirm }) {
  const [error, setError] = useState(null)
  const [removing, setRemoving] = useState(false)

  function handleRemove() {
    if (!balance?._id) return
    setError(null)
    setRemoving(true)
    balancesApi
      .delete(balance._id)
      .then(() => {
        onOpenChange(false)
        onConfirm?.()
      })
      .catch((err) => {
        setError(
          err.message
        )
      })
      .finally(() => setRemoving(false))
  }

  const label = balance
    ? `${balance.accountType} from ${balance.bankName}`
    : 'this account'

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="balances-dialog-overlay" />
        <Dialog.Content
          className="balances-dialog-content"
          aria-describedby="remove-balance-description"
        >
          <Dialog.Title className="balances-dialog-title">
            Remove account
          </Dialog.Title>
          <p id="remove-balance-description" className="balances-dialog-description">
            Are you sure you want to remove <strong>{label}</strong>?
          </p>
          {error && (
            <p className="balances-dialog-error" role="alert">
              {error}
            </p>
          )}
          <div className="balances-dialog-actions">
            <Dialog.Close asChild>
              <button type="button" className="balances-dialog-cancel">
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="button"
              className="balances-dialog-remove"
              onClick={handleRemove}
              disabled={removing}
            >
              {removing ? 'Removing…' : 'Remove'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default RemoveBalance
