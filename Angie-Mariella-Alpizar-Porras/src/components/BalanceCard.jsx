import { SpaceField } from './OrbitMark'
import { useLanguage } from '../i18n/useLanguage'

export function BalanceCard() {
  const { t } = useLanguage()

  return (
    <section className="balance" aria-labelledby="balance-label">
      <div className="balance__copy">
        <p id="balance-label" className="kicker">
          {t.balanceLabel}
        </p>
        <p className="balance__amount">
          <span>{t.balanceEmpty}</span>
          <span className="balance__unit">XLM</span>
        </p>
        <p className="balance__status">{t.walletStatus}</p>
      </div>
      <div className="balance__field">
        <SpaceField className="space-field" />
      </div>
    </section>
  )
}
