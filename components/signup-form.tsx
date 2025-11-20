"use client"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signUpWithEmail, loginWithSocial } from "@/lib/auth/auth-client"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const result = await signUpWithEmail(`${firstName} ${lastName}`, email, password)

    if (result.errorMessage) {
      toast.error(result.errorMessage)
      setPending(false)
    } else {
      // Success - redirect to home page
      toast.success("Account created successfully")
      router.push("/")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome!</h1>
                <p className="text-muted-foreground text-balance">
                  Create your &quot;Project Name&quot; account
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-3">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" type="text" placeholder="John" required />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" type="text" placeholder="Doe" required />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="johndoe@example.com" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={pending} aria-disabled={pending}>
                Sign Up
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" className="w-full" onClick={() => loginWithSocial("google")}>
                  <Image src="/Google.svg" alt="Google logo" width={24} height={24} />
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button variant="outline" type="button" className="w-full" onClick={() => loginWithSocial("microsoft")}>
                  <Image src="/Microsoft.svg" alt="Microsoft logo" width={24} height={24} />
                  <span className="sr-only">Login with Microsoft</span>
                </Button>
                <Button variant="outline" type="button" className="w-full" onClick={() => loginWithSocial("x")}>
                  <Image src="/X.svg" alt="X logo" width={24} height={24} className="invert dark:invert-0" />
                  <span className="sr-only">Login with X</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image src="/Logo.jpg" alt="Steven Sousa Logo" width={1920} height={1080} className="absolute inset-0 w-full h-full object-fill" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
