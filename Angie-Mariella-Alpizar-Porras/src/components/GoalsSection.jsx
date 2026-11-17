import { useId, useRef, useState } from 'react'
import { useLanguage } from '../i18n/useLanguage'

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `goal-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function parseTarget(raw) {
  const trimmed = raw.trim().replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null
  const value = Number(trimmed)
  if (!Number.isFinite(value) || value <= 0) return null
  return value
}

function formatTarget(lang, value) {
  const formatted = new Intl.NumberFormat(lang === 'es' ? 'es-CR' : 'en-US', {
    maximumFractionDigits: 7,
  }).format(value)
  return `${formatted} XLM`
}

function amountToInput(lang, value) {
  const text = String(value)
  return lang === 'es' ? text.replace('.', ',') : text
}

export function GoalsSection() {
  const { lang, t } = useLanguage()
  const [goals, setGoals] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [draft, setDraft] = useState({ name: '', target: '' })
  const [errors, setErrors] = useState({})
  const formRef = useRef(null)
  const deleteRef = useRef(null)
  const nameId = useId()
  const targetId = useId()
  const nameErrorId = useId()
  const targetErrorId = useId()
  const targetHintId = useId()

  function openForm() {
    const node = formRef.current
    if (node && !node.open) node.showModal()
    node?.querySelector('input[name="name"]')?.focus()
  }

  function openCreate() {
    setEditingId(null)
    setDraft({ name: '', target: '' })
    setErrors({})
    setFormMode('create')
    openForm()
  }

  function openEdit(goal) {
    setEditingId(goal.id)
    setDraft({ name: goal.name, target: amountToInput(lang, goal.target) })
    setErrors({})
    setFormMode('edit')
    openForm()
  }

  function closeForm() {
    setFormMode(null)
    if (formRef.current?.open) formRef.current.close()
  }

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function saveGoal(event) {
    event.preventDefault()
    const name = draft.name.trim()
    const target = parseTarget(draft.target)
    const nextErrors = {}
    if (!name) nextErrors.name = true
    if (target === null) nextErrors.target = true
    if (nextErrors.name || nextErrors.target) {
      setErrors(nextErrors)
      return
    }

    if (formMode === 'edit') {
      setGoals((current) =>
        current.map((goal) => (goal.id === editingId ? { ...goal, name, target } : goal)),
      )
    } else {
      setGoals((current) => [...current, { id: createId(), name, target }])
    }
    closeForm()
  }

  function askDelete(goal) {
    setPendingDelete(goal)
    const node = deleteRef.current
    if (node && !node.open) node.showModal()
  }

  function closeDelete() {
    setPendingDelete(null)
    if (deleteRef.current?.open) deleteRef.current.close()
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setGoals((current) => current.filter((goal) => goal.id !== pendingDelete.id))
    closeDelete()
  }

  return (
    <section className="goals" id="goals" aria-labelledby="goals-title">
      <div className="goals__head">
        <h2 id="goals-title">{t.goalsTitle}</h2>
        <button type="button" className="btn btn--line" onClick={openCreate}>
          + {t.createGoal}
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="goals__empty">
          <p className="goals__empty-title">{t.emptyGoals}</p>
          <p className="goals__note">{t.emptyGoalsHint}</p>
        </div>
      ) : (
        <>
          <p className="goals__note">{t.targetDisclaimer}</p>
          <ol className="goal-list">
            {goals.map((goal, index) => (
              <li key={goal.id} className="goal">
                <span className="goal__index">/{String(index + 1).padStart(2, '0')}</span>
                <h3>{goal.name}</h3>
                <p className="goal__target">
                  <span>{t.targetLabel}</span>
                  {formatTarget(lang, goal.target)}
                </p>
                <div className="goal__actions">
                  <button type="button" className="btn btn--line" onClick={() => openEdit(goal)}>
                    {t.edit}
                  </button>
                  <button type="button" className="btn btn--line" onClick={() => askDelete(goal)}>
                    {t.remove}
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}

      <dialog
        ref={formRef}
        className="goal-dialog"
        aria-labelledby="goal-form-title"
        onClose={closeForm}
      >
        <form className="goal-form" onSubmit={saveGoal} noValidate>
          <div className="goal-form__head">
            <h3 id="goal-form-title">
              {formMode === 'edit' ? t.formEditTitle : t.formCreateTitle}
            </h3>
            <button type="button" className="btn btn--line" onClick={closeForm}>
              {t.close}
            </button>
          </div>
          <div className="field">
            <label htmlFor={nameId}>{t.nameLabel}</label>
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="off"
              value={draft.name}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? nameErrorId : undefined}
              onChange={(event) => updateDraft('name', event.target.value)}
            />
            {errors.name ? (
              <p id={nameErrorId} className="field__error" role="alert">
                {t.nameError}
              </p>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor={targetId}>{t.targetLabel}</label>
            <input
              id={targetId}
              name="target"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={draft.target}
              aria-invalid={errors.target ? 'true' : 'false'}
              aria-describedby={errors.target ? `${targetHintId} ${targetErrorId}` : targetHintId}
              onChange={(event) => updateDraft('target', event.target.value)}
            />
            <p id={targetHintId} className="field__hint">
              {t.targetHint}
            </p>
            {errors.target ? (
              <p id={targetErrorId} className="field__error" role="alert">
                {t.targetError}
              </p>
            ) : null}
          </div>
          <div className="dialog__actions">
            <button type="button" className="btn btn--line" onClick={closeForm}>
              {t.cancel}
            </button>
            <button type="submit" className="btn btn--solid">
              {t.save}
            </button>
          </div>
        </form>
      </dialog>

      <dialog
        ref={deleteRef}
        className="goal-dialog"
        aria-labelledby="delete-title"
        aria-describedby="delete-body"
        onClose={() => setPendingDelete(null)}
      >
        <h3 id="delete-title">{t.deleteTitle}</h3>
        <p id="delete-body" className="goals__note">
          {t.deleteBody.replace('{name}', pendingDelete?.name ?? '')}
        </p>
        <div className="dialog__actions">
          <button type="button" className="btn btn--line" onClick={closeDelete}>
            {t.cancel}
          </button>
          <button type="button" className="btn btn--solid" onClick={confirmDelete}>
            {t.confirmDelete}
          </button>
        </div>
      </dialog>
    </section>
  )
}
