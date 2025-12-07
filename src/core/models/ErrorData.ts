type ErrorObject = {
  operatorCode: number
  operatorMessage: string
}

export default class ErrorData {
  public errorCode: number = -1
  public errorMessage: string = ''
  public errorObject: ErrorObject = {
    operatorCode: 0,
    operatorMessage: '',
  }
}
