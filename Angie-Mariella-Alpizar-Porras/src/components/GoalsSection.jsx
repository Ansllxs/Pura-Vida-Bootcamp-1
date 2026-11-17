import { useLanguage } from '../i18n/useLanguage'

export function GoalsSection() {
  const { t } = useLanguage()

  return (
    <section className="goals" id="goals" aria-labelledby="goals-title">
      <div className="goals__head">
        <h2 id="goals-title">{t.goalsTitle}</h2>
        <button type="button" className="btn btn--line">
          + {t.createGoal}
        </button>
      </div>
      <p className="goals__note">{t.demoNote}</p>
      <ol className="goal-list">
        {t.goals.map((goal) => (
          <li key={goal.id} className="goal">
            <span className="goal__index">/{goal.index}</span>
            <div className="goal__name">
              <h3>{goal.name}</h3>
              <span className="demo">{t.demo}</span>
            </div>
            <p className="goal__target">{goal.target}</p>
            <div
              className="goal__track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={0}
              aria-label={`${goal.name} ${t.progress}`}
            >
              <span className="goal__fill" />
            </div>
            <p className="goal__percent">0%</p>
            <button type="button" className="btn btn--line btn--detail">
              {t.detail}
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
