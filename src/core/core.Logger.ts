export default class Logger {
  protected name = ''

  protected _warn(message: unknown) {
    console.groupCollapsed(
      `%c ${this.name} :: WARN `,
      `background: yellow; color: red; display: block;`,
    )
    console.log(message)
    console.groupEnd()
  }

  protected _info(message: unknown) {
    console.groupCollapsed(
      `%c ${this.name} :: INFO `,
      `background: blue; color: white; display: block;`,
    )
    console.log(message)
    console.groupEnd()
  }
}
