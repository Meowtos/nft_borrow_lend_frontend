'use client'
import { AppProgressBar } from 'next-nprogress-bar'
export function ProgressBar() {
  return (
      <AppProgressBar
        height="2px"
        color="#8E05C2"
        options={{ showSpinner: true }}
        shallowRouting
      />
  )
}
