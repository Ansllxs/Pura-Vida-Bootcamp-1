import { SpaceField } from './OrbitMark'
import { useLanguage } from '../i18n/useLanguage'
import { abbreviateAddress } from '../wallet/network'

function statusText(wallet, t) {
  if (wallet.phase === 'checking') return t.walletChecking
  if (wallet.phase === 'connecting') return t.walletConnecting
  if (wallet.phase === 'missing') return t.walletMissing
  if (wallet.phase === 'rejected') return t.walletRejected
  if (wallet.phase === 'error') return t.walletError
  if (wallet.phase === 'ready' && !wallet.testnet) return t.walletWrongNetwork
  if (wallet.phase === 'ready') return `${t.walletConnected} ${abbreviateAddress(wallet.address)}`
  if (wallet.notice === 'local') return t.walletDisconnectNote
  return t.walletStatus
}

export function BalanceCard({ wallet }) {
  const { t } = useLanguage()
  const wrongNetwork = wallet.phase === 'ready' && !wallet.testnet

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
        <p className="balance__status" role="status">
          {statusText(wallet, t)}
        </p>
        {wrongNetwork ? <p className="balance__warn">{t.walletWrongNetworkHint}</p> : null}
        {wallet.phase === 'missing' ? <p className="balance__warn">{t.walletInstallHint}</p> : null}
      </div>
      <div className="balance__field">
        <SpaceField className="space-field" />
      </div>
    </section>
  )
}
