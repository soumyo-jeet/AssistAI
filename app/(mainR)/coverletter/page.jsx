import { getCoverLetters } from "@/actions/cover-letter";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}