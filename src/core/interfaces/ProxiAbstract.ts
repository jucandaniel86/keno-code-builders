export default abstract class ProxiAbstract {
  abstract gameReady(): void
  abstract gameExit(): void
  abstract serverInitComplete(): void
  abstract visitLobby(): void
  abstract visitCashier(): void
  abstract visitHistory(): void
  abstract roundStart(_bet: number, _credit: number): void
  abstract toggleWrapperActive(_boolean: boolean): void
  abstract toggleRealityCheck(_boolean: boolean): void
  abstract sendRoundOn(_boolean: boolean): void
  abstract toggleSound(_boolean: boolean): void
  abstract updateLoadingProgress(_percent: number): void
  abstract updateWinnings(_number: number): void
  abstract updateStake(_number: number): void
  abstract updateBalance(_number: number, _stake: number): void
  abstract sendWindowSize(_width: number, _height: number): void
  abstract roundStarted(_obj: any): void
  abstract roundEnded(_obj: any): void
  abstract gameLoadingStarted(): void
  abstract paytableDialogueOpened(): void
  abstract paytableDialogueClosed(): void
  abstract insufficientFunds(): void
  abstract gameLoadingEnded(_string: string, _obj: any): void
  abstract rulesDialogueOpened(): void
  abstract rulesDialogueClosed(): void
  abstract gotoAccountsPage(): void
  abstract gotoResponsibleGamingPage(): void
  abstract menuDialogOpened(): void
  abstract menuDialogClosed(): void
  abstract betDialogueOpened(): void
  abstract betDialogueClosed(): void
  abstract autospinDialogueOpened(): void
  abstract autospinDialogueClosed(): void
  abstract gameReload(): void
  abstract visitRules(): void
}
