export const setPaddingTopUsingNavHeight = (elementId: string, paddingSize: string): void => {
  const navHeight = (document.getElementById('navbar') as HTMLDivElement).clientHeight

  document
    .getElementById(elementId)
    ?.style.setProperty('padding-top', `calc(${paddingSize} + ${navHeight}px)`)
}
