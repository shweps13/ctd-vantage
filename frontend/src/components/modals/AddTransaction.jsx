import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { transactionsApi } from '../../services/api'

const payMethods = ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Other']
const txTypes = [
  { id: 'expense', label: 'Expense' },
  { id: 'revenue', label: 'Revenue' },
]

const initialForm = {
  itemDescription: '',
  shopName: '',
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: 'Credit Card',
  amount: '',
  transactionType: 'expense',
}

function getFormFromTransaction(tx) {
  if (!tx) return initialForm
  const d = tx.date ? new Date(tx.date) : new Date()
  return {
    itemDescription: tx.itemDescription || '',
    shopName: tx.shopName || '',
    date: d.toISOString().slice(0, 10),
    paymentMethod: tx.paymentMethod || 'Credit Card',
    amount: tx.amount != null ? String(tx.amount) : '',
    transactionType: tx.transactionType || 'expense',
  }
}

function AddTransaction({ open, onOpenChange, onSuccess, balanceId, transaction }) {
  const isEdit = Boolean(transaction)
  const [form, setForm] = useState(() => getFormFromTransaction(transaction))
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    const payload = {
      itemDescription: form.itemDescription.trim(),
      shopName: form.shopName.trim(),
      date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
      paymentMethod: form.paymentMethod,
      amount: Number(form.amount) || 0,
      transactionType: form.transactionType,
    }
    const request = isEdit
      ? transactionsApi.update(transaction._id, payload)
      : (balanceId ? transactionsApi.create({ ...payload, balance: balanceId }) : Promise.reject(new Error('Balance required')))
    request
      .then(() => {
        onOpenChange(false)
        onSuccess?.()
      })
      .catch((err) => {
        setSubmitError(
          err.response?.data?.message ?? err.response?.data?.msg ?? err.message
        )
      })
      .finally(() => setSubmitting(false))
  }

  const formState = form || getFormFromTransaction(transaction)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="balances-dialog-overlay" />
        <Dialog.Content
          className="balances-dialog-content"
          aria-describedby={undefined}
        >
          <Dialog.Title className="balances-dialog-title">
            {isEdit ? 'Edit transaction' : 'Add transaction'}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="balances-dialog-form">
            {submitError && (
              <p className="balances-dialog-error" role="alert">
                {submitError}
              </p>
            )}
            <label className="balances-dialog-label">
              Item description
              <input
                type="text"
                value={formState.itemDescription}
                onChange={(e) =>
                  setForm((f) => ({ ...f, itemDescription: e.target.value }))
                }
                placeholder="Polo shirt"
                maxLength={200}
                required
                className="balances-dialog-input"
              />
            </label>
            <label className="balances-dialog-label">
              Shop name
              <input
                type="text"
                value={formState.shopName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shopName: e.target.value }))
                }
                placeholder="XL fashions"
                maxLength={100}
                required
                className="balances-dialog-input"
              />
            </label>
            <label className="balances-dialog-label">
              Date
              <input
                type="date"
                value={formState.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
                className="balances-dialog-input"
              />
            </label>
            <label className="balances-dialog-label">
              Payment method
              <select
                value={formState.paymentMethod}
                onChange={(e) =>
                  setForm((f) => ({ ...f, paymentMethod: e.target.value }))
                }
                required
                className="balances-dialog-input"
              >
                {payMethods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="balances-dialog-label">
              Type
              <select
                value={formState.transactionType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, transactionType: e.target.value }))
                }
                required
                className="balances-dialog-input"
              >
                {txTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="balances-dialog-label">
              Amount
              <input
                type="number"
                min={0}
                step="0.01"
                value={formState.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                placeholder="0.00"
                required
                className="balances-dialog-input"
              />
            </label>
            <div className="balances-dialog-actions">
              <Dialog.Close asChild>
                <button type="button" className="balances-dialog-cancel">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="balances-dialog-submit"
                disabled={submitting}
              >
                {submitting
                  ? (isEdit ? 'Saving…' : 'Adding…')
                  : (isEdit ? 'Save changes' : 'Add transaction')}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default AddTransaction
