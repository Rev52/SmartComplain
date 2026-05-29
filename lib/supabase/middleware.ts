import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // Belum login → coba akses dashboard → redirect ke login
    if (!user && (path.startsWith('/user') || path.startsWith('/admin'))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Sudah login → coba akses login/register → redirect sesuai role
    if (user && (path === '/login' || path === '/register')) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = profile?.role ?? 'user'
        const redirectTo = role === 'admin' ? '/admin/beranda' : '/beranda'
        return NextResponse.redirect(new URL(redirectTo, request.url))
    }

    return supabaseResponse
}