import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { balancesApi } from '../../services/api'

const accTypes = ['Credit Card', 'Checking', 'Savings', 'Investment', 'Loan']

const initialForm = {
  accountType: 'Checking',
  bankName: '',
  accountNumber: '',
  balance: 0,
  branchName: '',
}

function getFormFromBalance(balance) {
  if (!balance) return initialForm
  return {
    accountType: balance.accountType || 'Checking',
    bankName: balance.bankName || '',
    accountNumber: String(balance.accountNumber ?? ''),
    balance: Number(balance.balance) || 0,
    branchName: balance.branchName || '',
  }
}

function AddAccountModal({ open, onOpenChange, onSuccess, balance }) {
  const isEdit = Boolean(balance)
  const [form, setForm] = useState(() => getFormFromBalance(balance))
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    const payload = {
      accountType: form.accountType,
      bankName: form.bankName.trim(),
      accountNumber: String(form.accountNumber).trim(),
      balance: Number(form.balance) || 0,
      branchName: form.branchName.trim() || undefined,
    }
    const request = isEdit
      ? balancesApi.update(balance._id, payload)
      : balancesApi.create(payload)
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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="balances-dialog-overlay" />
        <Dialog.Content
          className="balances-dialog-content"
          aria-describedby={undefined}
        >
          <Dialog.Title className="balances-dialog-title">
            {isEdit ? 'Edit account' : 'Add account'}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="balances-dialog-form">
            {submitError && (
              <p className="balances-dialog-error" role="alert">
                {submitError}
              </p>
            )}
            <label className="balances-dialog-label">
              Account type
              <select
                value={form.accountType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, accountType: e.target.value }))
                }
                required
                className="balances-dialog-input"
              >
                {accTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="balances-dialog-label">
              Bank name
              <input
                type="text"
                value={form.bankName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bankName: e.target.value }))
                }
                placeholder="e.g. City Bank Ltd."
                maxLength={20}
                required
                className="balances-dialog-input"
              />
            </label>
            <label className="balances-dialog-label">
              Account number (max 16 digits)
              <input
                type="text"
                inputMode="numeric"
                value={form.accountNumber}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
                  setForm((f) => ({ ...f, accountNumber: digits }))
                }}
                placeholder="e.g. 1234567890123456"
                maxLength={16}
                required
                className="balances-dialog-input"
              />
            </label>
            <label className="balances-dialog-label">
              Balance
              <input
                type="number"
                min={0}
                step="any"
                value={form.balance || ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    balance: e.target.value === '' ? 0 : e.target.value,
                  }))
                }
                required
                className="balances-dialog-input"
              />
            </label>
            <label className="balances-dialog-label">
              Branch name{' '}
              <span className="balances-dialog-optional">(optional)</span>
              <input
                type="text"
                value={form.branchName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, branchName: e.target.value }))
                }
                placeholder="e.g. Main branch"
                maxLength={50}
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
                  : (isEdit ? 'Save changes' : 'Add account')}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default AddAccountModal
