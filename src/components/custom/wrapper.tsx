import Link from "next/link"

type Props = {
  children: React.ReactNode
  className?: string
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
}

export default function Wrapper({
  children,
  className,
  headerLabel,
  backButtonLabel,
  backButtonHref
}: Props) {
  return (
    <div className={`${className} py-8 px-4 w-[400px] shadow-md border-2 border-yellow-300 rounded-xl bg-blue-400`}>
      <div className='pb-8 w-full flex flex-col gap-y-4 items-center justify-center'>
        <h1 className='text-4xl font-semibold'>
          🌷 {headerLabel} 🧚🏻‍♀️
        </h1>
      </div>
      <div>
        {children}
      </div>
      <footer className='pt-4'>
        <button className='px-4 py-2 border-2 border-yellow-300 bg-sky-200 rounded-full'>
          <Link href={backButtonHref}>
            {backButtonLabel}
          </Link>
        </button>
      </footer>
    </div>
  )
}
