import Image from "next/image";

export default function UnableToFetch() {
  return (
    <div className="flex flex-col items-center justify-center bg-transparent px-6 py-12 text-center">
      <Image
        src="/unable-to-fetch.png"
        alt=""
        width={280}
        height={280}
        unoptimized
        className="bg-transparent dark:hidden"
      />
      <Image
        src="/unable-to-fetch-dark.png"
        alt=""
        width={280}
        height={280}
        unoptimized
        className="hidden bg-transparent dark:block"
      />
      <p className="mt-2 text-lg font-medium text-gray-900 dark:text-zinc-100">
        Unable to fetch the data
      </p>
    </div>
  );
}
