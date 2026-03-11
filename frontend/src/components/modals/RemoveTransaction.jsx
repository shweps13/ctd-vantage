import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { transactionsApi } from '../../services/api'
import { moneyFormatter } from '../../services/helpers'

function RemoveTransaction({ open, onOpenChange, transaction, onConfirm }) {
  const [error, setError] = useState(null)
  const [removing, setRemoving] = useState(false)

  function handleRemove() {
    if (!transaction?._id) return
    setError(null)
    setRemoving(true)
    transactionsApi
      .delete(transaction._id)
      .then(() => {
        onOpenChange(false)
        onConfirm?.()
      })
      .catch((err) => {
        setError(
          err.message ?? 'Failed to remove'
        )
      })
      .finally(() => setRemoving(false))
  }

  const label = `${transaction?.itemDescription || 'Transaction'} (${moneyFormatter(transaction?.amount ?? 0)})`

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="balances-dialog-overlay" />
        <Dialog.Content
          className="balances-dialog-content"
          aria-describedby="remove-transaction-description"
        >
          <Dialog.Title className="balances-dialog-title">
            Remove transaction
          </Dialog.Title>
          <p id="remove-transaction-description" className="balances-dialog-description">
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

export default RemoveTransaction
