const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const PlusIcon = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const HomeIcon = (p) => (
  <svg {...base} {...p}><path d="M4 11l8-7 8 7M6 10v10h12V10" /></svg>
)
export const HistoryIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
export const SearchIcon = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
)
export const CloseIcon = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
)
export const CheckIcon = (p) => (
  <svg {...base} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)
export const ExitIcon = (p) => (
  <svg {...base} {...p}><path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10" /></svg>
)
export const AlertIcon = (p) => (
  <svg {...base} {...p}><path d="M12 4l9 16H3L12 4zM12 10v4M12 17.5v.01" /></svg>
)
