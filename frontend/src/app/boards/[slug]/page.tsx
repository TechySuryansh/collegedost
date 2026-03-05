import { Suspense } from "react";
import PageContent from "./content";

export default function BoardDetailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><div className="animate-spin h-10 w-10 border-2 border-brand-orange rounded-full border-t-transparent"></div></div>}>
            <PageContent />
        </Suspense>
    );
}
