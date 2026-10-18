interface Props {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function AdminHeader({ title, subtitle, action }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 mb-7 pt-1">
      <div>
        <h1 className="font-display text-2xl text-brand-teal-dark">{title}</h1>
        {subtitle && <p className="font-body text-sm text-[#3d5a65] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
