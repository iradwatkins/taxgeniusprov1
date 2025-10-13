import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

export const metadata = {
  title: 'Tax Preparer Academy | Tax Genius Pro',
  description: 'Comprehensive tax preparation training videos and resources',
}

async function hasAcademyAccess() {
  const user = await currentUser()
  if (!user) return false

  const role = user.publicMetadata?.role as string

  // Tax preparers, admins, and super_admins have academy access
  return role === 'tax_preparer' || role === 'admin' || role === 'super_admin'
}

export default async function AcademyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hasAccess = await hasAcademyAccess()

  if (!hasAccess) {
    redirect('/forbidden')
  }

  return children
}
