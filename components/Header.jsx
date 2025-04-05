import { SignInButton, SignedOut, UserButton, SignUpButton, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, LayoutDashboard, StarsIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { authUser } from "@/lib/auth";

async function Header() {
    await authUser();
    return (
        <header className="bg-background/80 backdrop-blur-sm border-b fixed top-0 w-full z-50">
            <nav className="container mx-auto px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.png"
                            alt="AssistAI Logo"
                            width={160}
                            height={40}
                            className="h-10 w-auto object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Spacer - creates space between logo and navigation items */}
                <div className="flex-1" />

                {/* Navigation Items */}
                <div className="flex items-center gap-4">
                    <SignedIn>
                        <Button asChild variant="ghost" className="gap-2">
                            <Link href="/dashboard">
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="hidden md:inline">Dashboard</span>
                            </Link>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2">
                                    <StarsIcon className="h-4 w-4" />
                                    <span className="hidden md:inline">Insights</span>
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Explore Now</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link href="/interview" className="w-full">Interview Prep</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link href="/resume" className="w-full">Build Resume</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link href="/coverletter" className="w-full">Cover Letter</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SignedIn>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-2 ml-6">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="outline" size="sm">
                                Sign In
                            </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button size="sm">
                                Get Started
                            </Button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </nav>
        </header>
    );
}

export default Header;