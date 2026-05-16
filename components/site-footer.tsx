import Image from "next/image";

export function SiteFooter() {
  return (
    <>
      <footer className="border-t border-[#E8EAED] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/images/top-ten-small.png"
              alt="Ranking Top 10"
              width={80}
              height={80}
              className="size-20 rounded-2xl"
              unoptimized
            />
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5F6368]">
              Google trademarks belong to Google LLC. The ranking is organized by
              rankingtop10.com.
            </p>
          </div>
        </div>
      </footer>
      <div aria-hidden="true" className="hidden h-[75vh] md:block" />
    </>
  );
}
