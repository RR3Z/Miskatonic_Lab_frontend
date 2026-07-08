import type { SVGProps } from "react"

export function CloseStamp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 137 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Закрыто</title>
      <rect
        x="0"
        y="0"
        width="137"
        height="39"
        rx="4"
        fill="none"
        stroke="#8b211f"
        strokeWidth="3.5"
      />
      <text
        x="68.5"
        y="26"
        textAnchor="middle"
        fill="#8b211f"
        fontSize="18"
        fontWeight="900"
        letterSpacing="4"
      >
        ЗАКРЫТО
      </text>
    </svg>
  )
}
