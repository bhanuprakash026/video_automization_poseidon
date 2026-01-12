export function Navbar() {
    return (
        <nav className="border-b bg-white">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                <span className="font-semibold text-lg">Video Atomizer</span>
                <div className="flex gap-6 text-sm font-medium">
                    <a href="/upload" className="hover:text-indigo-600">
                        Upload
                    </a>
                    <a href="/dashboard" className="hover:text-indigo-600">
                        Dashboard
                    </a>
                </div>
            </div>
        </nav>
    );
}
