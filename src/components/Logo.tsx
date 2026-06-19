import Image from 'next/image'

type LogoProps = {
  size?: number
  className?: string
  priority?: boolean
}

export default function Logo({ size = 80, className = '', priority = false }: LogoProps) {
  return (
    <Image
      src="/icon-512.png"
      alt="HealthOX — Scan. Know. Choose Better"
      width={size}
      height={size}
      priority={priority}
      className={`rounded-full object-cover ${className}`}
    />
  )
}
